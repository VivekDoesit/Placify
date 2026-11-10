import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/prediction', label: 'Prediction' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/insights', label: 'Insights' },
  { to: '/about', label: 'About' },
]

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-semibold transition-colors ${isActive ? 'bg-sage text-navy' : 'text-navy-80 hover:text-navy'}`

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-cream/95 backdrop-blur-sm">
      <nav aria-label="Main" className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-navy" aria-label="Placify home">
          PLACIFY
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.to}><NavLink to={l.to} end={l.end} className={linkClass}>{l.label}</NavLink></li>
          ))}
        </ul>

        <Link to="/prediction" className="btn-primary hidden lg:inline-flex">Predict My Placement →</Link>

        <button
          type="button"
          className="rounded-md p-2 text-navy lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-navy/10 bg-cream lg:hidden">
          <ul className="container-page flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <li key={l.to}><NavLink to={l.to} end={l.end} className={({ isActive }) => `block ${linkClass({ isActive })} py-3 text-base`}>{l.label}</NavLink></li>
            ))}
            <li className="pt-2"><Link to="/prediction" className="btn-primary w-full">Predict My Placement →</Link></li>
          </ul>
        </div>
      )}
    </header>
  )
}
