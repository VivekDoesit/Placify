import { Link } from 'react-router-dom'
import { BarChart3, Compass, GraduationCap, LineChart, Sparkles, Target } from 'lucide-react'
import useApi from '../hooks/useApi.js'
import { getModelInfo } from '../services/api.js'
import { percent } from '../utils/format.js'

const STEPS = [
  { title: 'Build Your Profile', text: 'Enter your academic marks, projects, aptitude and preparation details.' },
  { title: 'Analyze Your Data', text: 'Your inputs pass through the same preprocessing used when the model was trained.' },
  { title: 'Generate Prediction', text: 'A Logistic Regression model classifies the profile and reports its probability.' },
  { title: 'Get Career Guidance', text: 'Rule-based suggestions highlight possible focus areas from your own inputs.' },
]

const FEATURES = [
  { icon: Target, title: 'Placement Prediction', text: 'A real classifier trained on 10,000 historical student records.' },
  { icon: LineChart, title: 'Profile Overview', text: 'Transparent bars showing each value you entered against its scale.' },
  { icon: Compass, title: 'Career Guidance', text: 'Up to three possible focus areas, chosen by readable rules.' },
  { icon: BarChart3, title: 'Model Insights', text: 'Accuracy, precision, recall, F1 and the confusion matrix.' },
]

function IllustrativeCard() {
  const rows = [['Academic', 'w-4/5'], ['Technical', 'w-3/5'], ['Aptitude', 'w-[70%]'], ['Preparation', 'w-1/2']]
  return (
    <figure className="rounded-3xl border border-navy/10 bg-sage p-6 shadow-sm sm:p-8" aria-label="Illustrative profile card">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-cream"><GraduationCap size={22} aria-hidden="true" /></span>
        <div>
          <p className="font-bold">Sample student profile</p>
          <p className="text-xs text-navy-80">Illustrative layout only, not a real prediction</p>
        </div>
      </div>
      <ul className="mt-6 space-y-4">
        {rows.map(([label, width]) => (
          <li key={label}>
            <p className="mb-1 text-sm font-semibold">{label}</p>
            <div className="h-2.5 rounded-full bg-cream"><div className={`h-full rounded-full bg-navy ${width}`} /></div>
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-2xl bg-navy px-5 py-4 text-cream">
        <p className="text-xs text-cream/80">Your result will appear here</p>
        <p className="text-lg font-extrabold">Model classification and probability</p>
      </div>
    </figure>
  )
}

export default function Home() {
  const { data: info, error, loading } = useApi(getModelInfo)

  return (
    <>
      <section className="container-page grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[1.15fr_1fr] lg:pt-20">
        <div className="animate-rise">
          <p className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-brown"><Sparkles size={16} aria-hidden="true" /> Student placement intelligence</p>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">Your Career Starts With Understanding Your Profile.</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-80">
            Use machine learning to explore how your academic performance, skills development, experience and career preparation relate to placement outcomes in historical student data.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/prediction" className="btn-primary">Predict My Placement →</Link>
            <Link to="/how-it-works" className="btn-secondary">Explore How It Works</Link>
          </div>
        </div>
        <IllustrativeCard />
      </section>

      <section className="bg-navy py-16 text-cream" aria-labelledby="real-data">
        <div className="container-page">
          <h2 id="real-data" className="text-3xl font-extrabold tracking-tight">Built With Real Data</h2>
          {error ? (
            <p role="alert" className="mt-6 text-cream/90">{error}</p>
          ) : (
            <dl className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
              {[
                [info ? info.dataset_rows.toLocaleString() : '…', 'Student Records'],
                [info ? info.predictive_features : '…', 'Predictive Features'],
                [info ? info.algorithm : '…', 'Classification Model'],
                [info ? percent(info.accuracy) : '…', 'Actual Test Accuracy'],
              ].map(([value, label]) => (
                <div key={label} className="border-l-2 border-brown pl-4">
                  <dd className="text-2xl font-extrabold tabular-nums sm:text-3xl" aria-busy={loading}>{value}</dd>
                  <dt className="mt-1 text-sm text-cream/80">{label}</dt>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <section className="container-page py-20" aria-labelledby="how">
        <h2 id="how" className="text-3xl font-extrabold tracking-tight">How it works</h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brown text-sm font-extrabold text-white">{i + 1}</span>
              <h3 className="mt-4 text-lg font-extrabold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-80">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page" aria-labelledby="features">
        <h2 id="features" className="sr-only">Features</h2>
        <ul className="grid gap-5 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="card flex gap-4">
              <Icon className="mt-1 h-6 w-6 shrink-0 text-brown" aria-hidden="true" />
              <div>
                <h3 className="text-lg font-extrabold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-navy-80">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
