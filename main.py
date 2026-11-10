"""Placify FastAPI application."""
import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from schemas.prediction import ModelInfo, PredictionResponse, StudentProfile
from services.guidance import build_focus_areas
from services.predictor import ModelUnavailableError, Predictor

logger = logging.getLogger("placify")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Model is loaded once at startup, never per request.
    try:
        app.state.predictor = Predictor()
    except ModelUnavailableError:
        logger.exception("Model failed to load")
        app.state.predictor = None
    yield


app = FastAPI(title="Placify API", version="1.0.0", lifespan=lifespan)

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
if os.getenv("FRONTEND_URL"):
    origins.append(os.environ["FRONTEND_URL"].rstrip("/"))
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["GET", "POST"],
                   allow_headers=["Content-Type"])


@app.exception_handler(RequestValidationError)
async def validation_handler(_: Request, exc: RequestValidationError):
    details = [{"field": ".".join(str(x) for x in e["loc"][1:]), "message": e["msg"]}
               for e in exc.errors()]
    return JSONResponse(status_code=422, content={"detail": "Invalid input.", "errors": details})


@app.exception_handler(Exception)
async def unexpected_handler(_: Request, exc: Exception):
    logger.exception("Unhandled error", exc_info=exc)
    return JSONResponse(status_code=500, content={"detail": "Something went wrong on the server."})


def _predictor(request: Request) -> Predictor | None:
    return request.app.state.predictor


def _unavailable() -> JSONResponse:
    return JSONResponse(status_code=503, content={"detail": "The prediction model is currently unavailable."})


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/model-info")
def model_info(request: Request):
    predictor = _predictor(request)
    if predictor is None:
        return _unavailable()
    return ModelInfo(**{k: predictor.metadata[k] for k in ModelInfo.model_fields})


@app.get("/model-evaluation")
def model_evaluation(request: Request):
    predictor = _predictor(request)
    if predictor is None:
        return _unavailable()
    return predictor.evaluation


@app.post("/predict", response_model=PredictionResponse)
def predict(profile: StudentProfile, request: Request):
    predictor = _predictor(request)
    if predictor is None:
        return _unavailable()
    data = profile.model_dump()
    label, probability = predictor.predict(data)
    return PredictionResponse(
        prediction=label,
        probability=probability,
        model_accuracy=predictor.metadata["accuracy"],
        focus_areas=build_focus_areas(data),
    )
