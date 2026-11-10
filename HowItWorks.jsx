import PageHeader from '../components/PageHeader.jsx'

const PIPELINE = [
  ['Dataset', 'A CSV of 10,000 historical student records.'],
  ['Data Preparation', 'Check columns and missing values; drop the StudentID identifier.'],
  ['Feature Processing', 'Scale numeric values and one-hot encode the Yes/No columns.'],
  ['Logistic Regression', 'Learn weights that separate Placed from NotPlaced on the training split.'],
  ['Prediction', 'Classify a new profile and report the probability of the predicted class.'],
  ['Career Guidance', 'Apply readable rules to your inputs to suggest focus areas.'],
]

const CONCEPTS = [
  ['What is classification?', 'Classification is a type of machine learning where a model assigns an input to one of several categories. Here there are two: Placed and NotPlaced.'],
  ['What is Logistic Regression?', 'Despite the name, it is a classification method. It combines your inputs with learned weights, then converts the result into a probability between 0 and 1. The class with the higher probability becomes the prediction.'],
  ['What is a training dataset?', 'The portion of the data (80%) the model learns from. It sees the inputs and the known outcomes, and adjusts its weights to fit the patterns.'],
  ['What is a test dataset?', 'The other 20%, kept hidden during training. Evaluating on it shows how the model handles students it has never seen.'],
  ['Why is accuracy used?', 'Accuracy is the share of test students the model classified correctly. It is easy to understand, but we also report precision, recall and F1 because a single number can hide the kinds of mistakes a model makes.'],
]

export default function HowItWorks() {
  return (
    <>
      <PageHeader title="How It Works" subtitle="From a CSV file to a prediction: the pipeline behind Placify, explained for students." />
      <section className="container-page" aria-labelledby="pipeline">
        <h2 id="pipeline" className="sr-only">Pipeline</h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PIPELINE.map(([title, text], i) => (
            <li key={title} className="card">
              <p className="text-sm font-bold text-brown">Stage {i + 1} of {PIPELINE.length}</p>
              <h3 className="mt-1 text-lg font-extrabold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-80">{text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="container-page mt-16 max-w-3xl" aria-labelledby="concepts">
        <h2 id="concepts" className="text-2xl font-extrabold">Key concepts</h2>
        <dl className="mt-6 space-y-6">
          {CONCEPTS.map(([q, a]) => (
            <div key={q}>
              <dt className="text-lg font-extrabold">{q}</dt>
              <dd className="mt-1 leading-relaxed text-navy-80">{a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  )
}
