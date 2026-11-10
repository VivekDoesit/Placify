import { FIELDS, fieldByKey } from '../utils/fields.js'

const BAR_FIELDS = FIELDS.filter((f) => f.scale)

// Bars are plain ratios of the entered value to a fixed denominator. They are not ML outputs.
export default function ProfileBars({ values }) {
  return (
    <div>
      <ul className="space-y-4">
        {BAR_FIELDS.map((f) => {
          const value = Number(values[f.key])
          const ratio = Math.min(1, Math.max(0, value / f.scale))
          return (
            <li key={f.key}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-semibold">{f.label}</span>
                <span className="tabular-nums text-navy-80">{value} / {f.scale}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-cream" role="progressbar" aria-label={f.label} aria-valuemin={0} aria-valuemax={f.scale} aria-valuenow={value}>
                <div className="h-full rounded-full bg-navy transition-[width] duration-700 ease-out" style={{ width: `${ratio * 100}%` }} />
              </div>
            </li>
          )
        })}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-navy-80">
        Each bar is the value you entered divided by its scale ({fieldByKey.CGPA.scale} for CGPA, 100 for percentages and aptitude, 5 for soft skills, and the dataset maximum for counts). These are simple visual ratios, not AI scores.
      </p>
    </div>
  )
}
