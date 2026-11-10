const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
const TIMEOUT_MS = 45000 // free hosting tiers can take a while to wake up

export class ApiError extends Error {}

async function request(path, options) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  let response
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, signal: controller.signal })
  } catch (err) {
    throw new ApiError(
      err.name === 'AbortError'
        ? 'The prediction service took too long to respond. Please try again.'
        : 'Unable to connect to the prediction service. Please try again.',
    )
  } finally {
    clearTimeout(timer)
  }

  let body = null
  try { body = await response.json() } catch { /* non-JSON body */ }

  if (!response.ok) {
    if (response.status === 422) throw new ApiError('Some of the values entered are outside the accepted range. Please review your profile.')
    if (response.status === 503) throw new ApiError('The prediction model is currently unavailable. Please try again later.')
    throw new ApiError('The prediction service returned an error. Please try again.')
  }
  return body
}

function assertShape(body, keys) {
  if (!body || keys.some((k) => !(k in body))) {
    throw new ApiError('The prediction service returned an unexpected response.')
  }
  return body
}

export const getModelInfo = async () =>
  assertShape(await request('/model-info'), ['accuracy', 'dataset_rows', 'predictive_features', 'algorithm'])

export const getModelEvaluation = async () =>
  assertShape(await request('/model-evaluation'), ['accuracy', 'precision', 'recall', 'f1_score', 'confusion_matrix', 'classes'])

export const predict = async (payload) =>
  assertShape(
    await request('/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
    ['prediction', 'probability', 'model_accuracy', 'focus_areas'],
  )
