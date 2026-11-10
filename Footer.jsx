import { Link } from 'react-router-dom'
import Disclaimer from './Disclaimer.jsx'

export default function Footer() {
  return (
    <footer className="mt-20 bg-navy text-cream">
      <div className="container-page py-12">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xl font-extrabold tracking-tight">PLACIFY</p>
            <p className="mt-2 max-w-sm text-sm text-cream/80">Student Placement Prediction &amp; Career Guidance</p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <li><Link className="hover:underline" to="/prediction">Prediction</Link></li>
              <li><Link className="hover:underline" to="/how-it-works">How It Works</Link></li>
              <li><Link className="hover:underline" to="/insights">Insights</Link></li>
              <li><Link className="hover:underline" to="/about">About</Link></li>
            </ul>
          </div>
          <Disclaimer />
        </div>
      </div>
    </footer>
  )
}
