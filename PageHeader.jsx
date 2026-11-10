export default function PageHeader({ title, subtitle }) {
  return (
    <div className="container-page pb-8 pt-12 sm:pt-16">
      <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{title}</h1>
      {subtitle && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-navy-80">{subtitle}</p>}
    </div>
  )
}
