import PageHeader from '../components/PageHeader.jsx'
import Disclaimer from '../components/Disclaimer.jsx'

const TECH = ['React', 'Vite', 'Tailwind CSS', 'FastAPI', 'Python', 'Pandas', 'Scikit-learn', 'Logistic Regression', 'GitHub', 'Vercel', 'Render']

export default function About() {
  return (
    <>
      <PageHeader title="About Placify" />
      <div className="container-page max-w-3xl space-y-10 pb-4">
        <section aria-labelledby="problem">
          <h2 id="problem" className="text-2xl font-extrabold">Problem</h2>
          <p className="mt-2 leading-relaxed text-navy-80">Students often find it difficult to understand how different aspects of their academic and career profile relate to historical placement outcomes.</p>
        </section>
        <section aria-labelledby="solution">
          <h2 id="solution" className="text-2xl font-extrabold">Solution</h2>
          <p className="mt-2 leading-relaxed text-navy-80">Placify demonstrates how a machine-learning classification model can analyze a student&rsquo;s profile and provide an educational prediction together with areas for development.</p>
        </section>
        <section aria-labelledby="tech">
          <h2 id="tech" className="text-2xl font-extrabold">Technology</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {TECH.map((t) => <li key={t} className="rounded-full border border-navy/20 bg-sage px-3.5 py-1.5 text-sm font-semibold">{t}</li>)}
          </ul>
        </section>
        <Disclaimer />
      </div>
    </>
  )
}
