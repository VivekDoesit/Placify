"""Transparent rule-based career guidance. NOT produced by the ML model."""

# Thresholds are fixed, readable rules. Severity (0-1) only orders the suggestions.
LOW_CGPA = 7.0
LOW_APTITUDE = 70
LOW_SOFT_SKILLS = 4.0
MIN_PROJECTS = 2
MIN_CERTS = 1
MAX_FOCUS_AREAS = 3


def build_focus_areas(p: dict) -> list[dict]:
    candidates: list[tuple[float, str, str]] = []

    if p["Internships"] == 0:
        candidates.append((1.0, "Practical experience",
            "Consider gaining practical experience through internships, freelance work, research or industry projects."))
    if p["CGPA"] < LOW_CGPA:
        candidates.append((min(1.0, (LOW_CGPA - p["CGPA"]) / 2 + 0.5), "Academic consistency",
            "Consider strengthening your academic consistency and focusing on core subjects."))
    if p["PlacementTraining"] == "No":
        candidates.append((0.8, "Placement preparation",
            "Consider participating in placement preparation programs, mock interviews and aptitude practice."))
    if p["AptitudeTestScore"] < LOW_APTITUDE:
        candidates.append((0.5 + (LOW_APTITUDE - p["AptitudeTestScore"]) / 100, "Aptitude",
            "Practice quantitative aptitude, logical reasoning and placement-style assessments."))
    if p["SoftSkillsRating"] < LOW_SOFT_SKILLS:
        candidates.append((0.5 + (LOW_SOFT_SKILLS - p["SoftSkillsRating"]) / 2, "Soft skills",
            "Work on communication, presentation, teamwork and interview skills."))
    if p["Projects"] < MIN_PROJECTS:
        candidates.append((0.6, "Technical projects",
            "Build additional practical projects that demonstrate your ability to apply technical concepts."))
    if p["Workshops_Certifications"] < MIN_CERTS:
        candidates.append((0.55, "Certifications and workshops",
            "Consider completing relevant certifications or workshops aligned with your target career path."))
    if p["ExtracurricularActivities"] == "No":
        candidates.append((0.3, "Teamwork and activities",
            "Consider participating in clubs, competitions or activities that develop teamwork and communication."))

    candidates.sort(key=lambda c: c[0], reverse=True)
    return [{"title": t, "suggestion": s} for _, t, s in candidates[:MAX_FOCUS_AREAS]]
