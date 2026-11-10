"""Loads the trained pipeline once and runs inference."""
import json
from pathlib import Path

import joblib
import pandas as pd

MODEL_DIR = Path(__file__).resolve().parent.parent / "model"

# API field name -> exact training column name
FIELD_TO_COLUMN = {"Workshops_Certifications": "Workshops/Certifications"}


class ModelUnavailableError(RuntimeError):
    """Raised when model artifacts are missing or unreadable."""


class Predictor:
    def __init__(self, model_dir: Path = MODEL_DIR):
        try:
            self.pipeline = joblib.load(model_dir / "placement_model.joblib")
            self.metadata = json.loads((model_dir / "model_metadata.json").read_text())
            self.evaluation = json.loads((model_dir / "evaluation.json").read_text())
        except Exception as exc:  # artifacts missing/corrupt -> clean error, no path leak
            raise ModelUnavailableError("Model artifacts could not be loaded.") from exc
        self.feature_names: list[str] = self.metadata["feature_names"]

    def to_frame(self, profile: dict) -> pd.DataFrame:
        row = {FIELD_TO_COLUMN.get(k, k): v for k, v in profile.items()}
        # Named columns in the exact training order; never positional.
        return pd.DataFrame([row])[self.feature_names]

    def predict(self, profile: dict) -> tuple[str, float]:
        frame = self.to_frame(profile)
        label = str(self.pipeline.predict(frame)[0])
        probabilities = self.pipeline.predict_proba(frame)[0]
        # Map via classes_ rather than assuming index 1 == Placed.
        index = list(self.pipeline.classes_).index(label)
        return label, float(probabilities[index])
