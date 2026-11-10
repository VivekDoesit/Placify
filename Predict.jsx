import { useState } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import PageHeader from '../components/PageHeader.jsx'
import { NumberField, YesNoField } from '../components/FormControls.jsx'
import ResultView from '../components/ResultView.jsx'
import { predict } from '../services/api.js'
import { FIELDS, GROUPS, REVIEW_ORDER, fieldByKey, toPayload, validateField } from '../utils/fields.js'

const STEPS = [
  { title: 'Academic Profile', groups: ['academic', 'aptitude'] },
  { title: 'Technical & Experience Profile', groups: ['technical', 'experience'] },
  { title: 'Review', groups: [] },
]

const EMPTY = Object.fromEntries(FIELDS.map((f) => [f.key, '']))

export default function Predict() {
  const [step, setStep] = useState(0)
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | done
  const [result, setResult] = useState(null)
  const [apiError, setApiError] = useState('')

  const handleChange = (key, value) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  const validate = (fields) => {
    const found = {}
    fields.forEach((f) => { const msg = validateField(f, values[f.key]); if (msg) found[f.key] = msg })
    setErrors((e) => ({ ...e, ...found }))
    return Object.keys(found).length === 0
  }

  const stepFields = (i) => FIELDS.filter((f) => STEPS[i].groups.includes(f.group))

  const next = () => { if (validate(stepFields(step))) setStep(step + 1) }

  const submit = async () => {
    if (status === 'loading') return
    if (!validate(FIELDS)) { setStep(0); return }
    setStatus('loading')
    setApiError('')
    try {
      setResult(await predict(toPayload(values)))
      setStatus('done')
    } catch (err) {
      setApiError(err.message)
      setStatus('idle')
    }
  }

  const reset = () => { setStatus('idle'); setResult(null); setStep(2) }

  if (status === 'done' && result) return <ResultView result={result} values={values} onReset={reset} />

  if (status === 'loading') {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center" role="status" aria-live="polite">
        <Loader2 className="h-10 w-10 animate-[spin-slow_1.2s_linear_infinite] text-brown" aria-hidden="true" />
        <p className="mt-5 text-2xl font-extrabold">Analyzing your profile...</p>
        <p className="mt-2 text-sm text-navy-80">If the service has been idle, the first request can take a little longer.</p>
      </div>
    )
  }

  return (
    <>
      <PageHeader title="Build Your Student Profile" subtitle="Enter your current academic and career information to generate a machine-learning prediction." />
      <div className="container-page pb-8">
        <ol className="mb-8 flex flex-wrap gap-x-6 gap-y-2" aria-label="Progress">
          {STEPS.map((s, i) => (
            <li key={s.title} aria-current={i === step ? 'step' : undefined} className={`text-sm font-bold ${i === step ? 'text-navy' : 'text-navy-60'}`}>
              <span className={`mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${i <= step ? 'bg-navy text-cream-light' : 'bg-sage text-navy'}`}>{i + 1}</span>
              {s.title}
            </li>
          ))}
        </ol>

        <form noValidate onSubmit={(e) => e.preventDefault()} className="max-w-3xl">
          {step < 2 && STEPS[step].groups.map((g) => (
            <section key={g} className="card mb-6" aria-labelledby={`g-${g}`}>
              <h2 id={`g-${g}`} className="mb-5 text-lg font-extrabold">{GROUPS[g]}</h2>
              <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
                {FIELDS.filter((f) => f.group === g).map((f) =>
                  f.type === 'yesno'
                    ? <YesNoField key={f.key} field={f} value={values[f.key]} error={errors[f.key]} onChange={handleChange} />
                    : <NumberField key={f.key} field={f} value={values[f.key]} error={errors[f.key]} onChange={handleChange} />)}
              </div>
            </section>
          ))}

          {step === 2 && (
            <section className="card mb-6" aria-labelledby="review-heading">
              <h2 id="review-heading" className="mb-5 text-lg font-extrabold">Review your profile</h2>
              <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {REVIEW_ORDER.map((key) => (
                  <div key={key} className="flex justify-between gap-4 border-b border-navy/10 pb-2">
                    <dt className="text-sm text-navy-80">{fieldByKey[key].label}</dt>
                    <dd className="text-sm font-bold tabular-nums">{values[key]}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {apiError && (
            <p role="alert" className="mb-4 flex items-start gap-2 rounded-lg border border-red-800/40 bg-white p-3 text-sm font-semibold text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {apiError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {step > 0
              ? <button type="button" className="btn-secondary" onClick={() => setStep(step - 1)}>{step === 2 ? 'Edit Profile' : 'Back'}</button>
              : <span />}
            {step < 2
              ? <button type="button" className="btn-primary" onClick={next}>Continue</button>
              : <button type="button" className="btn-primary" onClick={submit} disabled={status === 'loading'}>Predict Placement</button>}
          </div>
        </form>
      </div>
    </>
  )
}
