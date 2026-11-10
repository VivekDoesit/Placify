import { useId } from 'react'

export function NumberField({ field, value, error, onChange }) {
  const id = useId()
  const helpId = `${id}-help`
  const errId = `${id}-err`
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-bold">
        <span>{field.label}</span>
        <span className="text-xs font-medium text-navy-80">{field.unit}</span>
      </label>
      <input
        id={id}
        className={`input ${error ? 'border-red-700' : ''}`}
        type="number"
        inputMode="decimal"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        placeholder={field.type === 'number' ? `${field.min} to ${field.max}` : ''}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${helpId} ${errId}` : helpId}
        onChange={(e) => onChange(field.key, e.target.value)}
      />
      <p id={helpId} className="mt-1.5 text-xs leading-snug text-navy-80">{field.helper}</p>
      {error && <p id={errId} role="alert" className="mt-1 text-xs font-bold text-red-800">{error}</p>}
    </div>
  )
}

export function YesNoField({ field, value, error, onChange }) {
  const id = useId()
  const errId = `${id}-err`
  return (
    <fieldset aria-describedby={error ? errId : undefined}>
      <legend className="mb-1.5 text-sm font-bold">{field.label}</legend>
      <div role="radiogroup" aria-label={field.label} className="inline-flex w-full rounded-lg border border-navy/25 bg-white p-1">
        {['Yes', 'No'].map((option) => {
          const selected = value === option
          return (
            <label key={option} className={`flex-1 cursor-pointer rounded-md px-4 py-2.5 text-center text-sm font-bold transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-navy ${selected ? 'bg-navy text-cream-light' : 'text-navy-80 hover:bg-sage-light'}`}>
              <input type="radio" className="sr-only" name={field.key} value={option} checked={selected} onChange={() => onChange(field.key, option)} />
              {option}
            </label>
          )
        })}
      </div>
      <p className="mt-1.5 text-xs leading-snug text-navy-80">{field.helper}</p>
      {error && <p id={errId} role="alert" className="mt-1 text-xs font-bold text-red-800">{error}</p>}
    </fieldset>
  )
}
