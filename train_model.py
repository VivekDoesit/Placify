"""Train the Placify Logistic Regression pipeline on data/placementdata.csv."""
import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (accuracy_score, classification_report, confusion_matrix,
                             f1_score, precision_score, recall_score)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

BASE = Path(__file__).parent
DATA_PATH = BASE / "data" / "placementdata.csv"
MODEL_DIR = BASE / "model"

TARGET = "PlacementStatus"
ID_COLUMN = "StudentID"
NUMERIC = ["CGPA", "Internships", "Projects", "Workshops/Certifications",
           "AptitudeTestScore", "SoftSkillsRating", "SSC_Marks", "HSC_Marks"]
CATEGORICAL = ["ExtracurricularActivities", "PlacementTraining"]
POSITIVE_CLASS = "Placed"
TEST_SIZE = 0.2
RANDOM_STATE = 42


def main() -> None:
    df = pd.read_csv(DATA_PATH)
    required = [ID_COLUMN, *NUMERIC, *CATEGORICAL, TARGET]
    missing_cols = [c for c in required if c not in df.columns]
    if missing_cols:
        raise SystemExit(f"Dataset is missing required columns: {missing_cols}")

    print("Shape:", df.shape)
    print("Missing values per column:\n", df.isna().sum().to_string())
    print("Target distribution:\n", df[TARGET].value_counts().to_string())
    if df[required].isna().any().any():
        raise SystemExit("Dataset contains missing values; handle them before training.")

    X = df.drop(columns=[ID_COLUMN, TARGET])
    y = df[TARGET]
    features = NUMERIC + CATEGORICAL
    X = X[features]

    pipeline = Pipeline([
        ("preprocess", ColumnTransformer([
            ("num", StandardScaler(), NUMERIC),
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL),
        ])),
        ("model", LogisticRegression(random_state=RANDOM_STATE, max_iter=1000)),
    ])

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE, stratify=y)
    pipeline.fit(X_train, y_train)

    # Evaluation uses the held-out test set only.
    y_pred = pipeline.predict(X_test)
    classes = [str(c) for c in pipeline.classes_]
    metrics = {
        "accuracy": accuracy_score(y_test, y_pred),
        "precision": precision_score(y_test, y_pred, pos_label=POSITIVE_CLASS),
        "recall": recall_score(y_test, y_pred, pos_label=POSITIVE_CLASS),
        "f1_score": f1_score(y_test, y_pred, pos_label=POSITIVE_CLASS),
    }
    cm = confusion_matrix(y_test, y_pred, labels=classes)
    evaluation = {
        **{k: float(v) for k, v in metrics.items()},
        "positive_class": POSITIVE_CLASS,
        "classes": classes,
        "confusion_matrix": cm.tolist(),
        "classification_report": classification_report(y_test, y_pred, output_dict=True),
        "train_size": int(len(X_train)),
        "test_size_rows": int(len(X_test)),
    }
    metadata = {
        "model_name": "Student Placement Predictor",
        "algorithm": "Logistic Regression",
        "dataset_rows": int(len(df)),
        "predictive_features": len(features),
        "feature_names": features,
        "numeric_features": NUMERIC,
        "categorical_features": CATEGORICAL,
        "classes": classes,
        "test_size": TEST_SIZE,
        "random_state": RANDOM_STATE,
        "accuracy": float(metrics["accuracy"]),
        "trained_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }

    MODEL_DIR.mkdir(exist_ok=True)
    joblib.dump(pipeline, MODEL_DIR / "placement_model.joblib")
    (MODEL_DIR / "model_metadata.json").write_text(json.dumps(metadata, indent=2))
    (MODEL_DIR / "evaluation.json").write_text(json.dumps(evaluation, indent=2))

    print(f"\nclasses_ = {classes}")
    for k, v in metrics.items():
        print(f"{k}: {v:.4f}")
    print("Confusion matrix (rows=actual, cols=predicted, order=classes_):\n", cm)
    print(f"Artifacts saved to {MODEL_DIR}")


if __name__ == "__main__":
    main()
