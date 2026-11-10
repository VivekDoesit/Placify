import pytest
from fastapi.testclient import TestClient

from main import app
from services.predictor import ModelUnavailableError, Predictor
from pathlib import Path

VALID = {"CGPA": 8.4, "Internships": 2, "Projects": 3, "Workshops_Certifications": 2,
         "AptitudeTestScore": 85, "SoftSkillsRating": 4.5, "ExtracurricularActivities": "Yes",
         "PlacementTraining": "Yes", "SSC_Marks": 78, "HSC_Marks": 82}


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:  # runs lifespan -> loads model
        yield c


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_model_info(client):
    body = client.get("/model-info").json()
    assert body["algorithm"] == "Logistic Regression"
    assert body["predictive_features"] == 10
    assert 0 < body["accuracy"] <= 1


def test_predict_output(client):
    body = client.post("/predict", json=VALID).json()
    assert body["prediction"] in ("Placed", "NotPlaced")
    assert 0 <= body["probability"] <= 1
    assert len(body["focus_areas"]) <= 3


def test_probability_matches_predicted_class(client):
    predictor = app.state.predictor
    label, prob = predictor.predict(VALID)
    frame = predictor.to_frame(VALID)
    proba = predictor.pipeline.predict_proba(frame)[0]
    assert prob == pytest.approx(proba[list(predictor.pipeline.classes_).index(label)])
    assert prob >= 0.5  # predicted class always has the highest probability (binary)


@pytest.mark.parametrize("field,value", [("CGPA", 11), ("SSC_Marks", -1), ("SoftSkillsRating", 9),
                                         ("PlacementTraining", "Maybe"), ("Internships", -2)])
def test_invalid_input_rejected(client, field, value):
    r = client.post("/predict", json={**VALID, field: value})
    assert r.status_code == 422
    assert "Traceback" not in r.text


def test_missing_model_raises(tmp_path: Path):
    with pytest.raises(ModelUnavailableError):
        Predictor(tmp_path)
