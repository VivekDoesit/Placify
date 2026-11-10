import { Info } from 'lucide-react'

export default function Disclaimer({ className = '' }) {
  return (
    <aside className={`flex gap-3 rounded-xl border border-brown/30 bg-cream-light p-4 text-sm leading-relaxed text-navy-80 ${className}`} aria-label="Disclaimer">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-brown" aria-hidden="true" />
      <div className="space-y-2">
        <p>This is an educational machine-learning project. Predictions are based on patterns learned from the provided historical dataset and should not be treated as a guarantee of employment or as professional career advice.</p>
        <p>Model accuracy is measured on a held-out test dataset and does not guarantee the same performance on future students or real-world hiring outcomes.</p>
      </div>
    </aside>
  )
}
