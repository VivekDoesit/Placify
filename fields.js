// UI configuration for the 10 model inputs. Keys match the API payload.
// `max` for number fields = accepted upper bound; `scale` = denominator for the profile bars.
// Soft skills range comes from the dataset (3.0-4.8); other ranges follow the API validation.
export const GROUPS = {
  academic: 'Academic Performance',
  technical: 'Technical Development',
  aptitude: 'Aptitude & Soft Skills',
  experience: 'Experience & Preparation',
}

export const FIELDS = [
  { key: 'CGPA', label: 'CGPA', group: 'academic', type: 'number', min: 0, max: 10, step: 0.1, unit: 'out of 10', helper: 'Your current cumulative grade point average. The dataset ranges from 6.5 to 9.1.', scale: 10 },
  { key: 'SSC_Marks', label: 'SSC Marks', group: 'academic', type: 'number', min: 0, max: 100, step: 1, unit: '%', helper: 'Secondary school (10th) percentage.', scale: 100 },
  { key: 'HSC_Marks', label: 'HSC Marks', group: 'academic', type: 'number', min: 0, max: 100, step: 1, unit: '%', helper: 'Higher secondary (12th) percentage.', scale: 100 },
  { key: 'Projects', label: 'Projects', group: 'technical', type: 'number', min: 0, max: 50, step: 1, integer: true, unit: 'completed', helper: 'Practical projects you have completed. The dataset ranges from 0 to 3.', scale: 3 },
  { key: 'Workshops_Certifications', label: 'Workshops / Certifications', group: 'technical', type: 'number', min: 0, max: 50, step: 1, integer: true, unit: 'completed', helper: 'Workshops or certifications completed. The dataset ranges from 0 to 3.', scale: 3 },
  { key: 'AptitudeTestScore', label: 'Aptitude Test Score', group: 'aptitude', type: 'number', min: 0, max: 100, step: 1, unit: 'out of 100', helper: 'Your score in aptitude assessments. The dataset ranges from 60 to 90.', scale: 100 },
  { key: 'SoftSkillsRating', label: 'Soft Skills Rating', group: 'aptitude', type: 'number', min: 3, max: 4.8, step: 0.1, unit: '3.0 to 4.8', helper: 'Self or peer rating of communication and teamwork, on the dataset scale of 3.0 to 4.8.', scale: 5 },
  { key: 'Internships', label: 'Internships', group: 'experience', type: 'number', min: 0, max: 20, step: 1, integer: true, unit: 'completed', helper: 'Internships completed. The dataset ranges from 0 to 2.', scale: 2 },
  { key: 'PlacementTraining', label: 'Placement Training', group: 'experience', type: 'yesno', helper: 'Have you taken part in a placement training program?' },
  { key: 'ExtracurricularActivities', label: 'Extracurricular Activities', group: 'experience', type: 'yesno', helper: 'Clubs, competitions or similar activities.' },
]

export const REVIEW_ORDER = ['CGPA', 'Internships', 'Projects', 'Workshops_Certifications', 'AptitudeTestScore', 'SoftSkillsRating', 'ExtracurricularActivities', 'PlacementTraining', 'SSC_Marks', 'HSC_Marks']

export const fieldByKey = Object.fromEntries(FIELDS.map((f) => [f.key, f]))

export function validateField(field, raw) {
  if (raw === '' || raw === null || raw === undefined) return `${field.label} is required.`
  if (field.type === 'yesno') return raw === 'Yes' || raw === 'No' ? '' : 'Please choose Yes or No.'
  const n = Number(raw)
  if (!Number.isFinite(n)) return 'Enter a valid number.'
  if (field.integer && !Number.isInteger(n)) return 'Enter a whole number.'
  if (n < field.min || n > field.max) return `Enter a value between ${field.min} and ${field.max}.`
  return ''
}

export function toPayload(values) {
  return Object.fromEntries(FIELDS.map((f) => [f.key, f.type === 'yesno' ? values[f.key] : Number(values[f.key])]))
}
