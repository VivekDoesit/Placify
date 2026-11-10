"""Pydantic request/response schemas for the Placify API."""
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

YesNo = Literal["Yes", "No"]


class StudentProfile(BaseModel):
    """Input profile. Ranges follow the spec; SoftSkillsRating follows the dataset (3.0-4.8)."""
    model_config = ConfigDict(extra="forbid")

    CGPA: float = Field(ge=0, le=10)
    Internships: int = Field(ge=0, le=20)
    Projects: int = Field(ge=0, le=50)
    Workshops_Certifications: int = Field(ge=0, le=50)
    AptitudeTestScore: float = Field(ge=0, le=100)
    SoftSkillsRating: float = Field(ge=3.0, le=4.8)
    ExtracurricularActivities: YesNo
    PlacementTraining: YesNo
    SSC_Marks: float = Field(ge=0, le=100)
    HSC_Marks: float = Field(ge=0, le=100)


class FocusArea(BaseModel):
    title: str
    suggestion: str


class PredictionResponse(BaseModel):
    prediction: Literal["Placed", "NotPlaced"]
    probability: float = Field(ge=0, le=1, description="Model probability of the predicted class")
    model_accuracy: float
    focus_areas: list[FocusArea]


class ModelInfo(BaseModel):
    model_name: str
    algorithm: str
    dataset_rows: int
    predictive_features: int
    test_size: float
    random_state: int
    accuracy: float
    trained_at: str
    feature_names: list[str]
    classes: list[str]
