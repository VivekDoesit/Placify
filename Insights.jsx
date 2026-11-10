import PageHeader from '../components/PageHeader.jsx'
import ConfusionMatrix from '../components/ConfusionMatrix.jsx'
import Disclaimer from '../components/Disclaimer.jsx'
import useApi from '../hooks/useApi.js'
import { getModelEvaluation, getModelInfo } from '../services/api.js'
import { percent } from '../utils/format.js'

const load = () => Promise.all([getModelInfo(), getModelEvaluation()]).then(([info, evaluation]) => ({ info, evaluation }))

function Stat({ label, value }) {
  return (
    <div className="card">
      <dt className="text-sm text-navy-80">{label}</dt>
      <dd className="mt-1 text-2xl font-extrabold tabular-nums">{value}</dd>
    </div>
  )
}

export default function Insights() {
  const { data, error, loading } = useApi(load)

  return (
    <>
      <PageHeader title="Model Insights" subtitle="Every figure on this page is read from the evaluation of the saved model on its held-out test set." />
      <div className="container-page">
        {loading && <p role="status">Loading model details…</p>}
        {error && <p role="alert" className="rounded-lg border border-red-800/40 bg-white p-4 font-semibold text-red-800">{error}</p>}
        {data && (
          <>
            <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Stat label="Dataset size" value={`${data.info.dataset_rows.toLocaleString()} records`} />
              <Stat label="Predictive features" value={data.info.predictive_features} />
              <Stat label="Algorithm" value={data.info.algorithm} />
              <Stat label="Train / test split" value={`${Math.round((1 - data.info.test_size) * 100)} / ${Math.round(data.info.test_size * 100)}`} />
              <Stat label="Random state" value={data.info.random_state} />
              <Stat label="Accuracy" value={percent(data.evaluation.accuracy)} />
              <Stat label="Precision" value={percent(data.evaluation.precision)} />
              <Stat label="Recall" value={percent(data.evaluation.recall)} />
              <Stat label="F1 score" value={percent(data.evaluation.f1_score)} />
            </dl>
            <p className="mt-3 text-xs text-navy-80">Precision, recall and F1 treat &ldquo;{data.evaluation.positive_class}&rdquo; as the positive class.</p>

            <section className="card mt-10 max-w-2xl" aria-labelledby="cm">
              <h2 id="cm" className="text-xl font-extrabold">Confusion matrix</h2>
              <p className="mb-4 mt-1 text-sm text-navy-80">{data.evaluation.test_size_rows.toLocaleString()} held-out test students. Rows are the actual outcome; columns are the model&rsquo;s prediction.</p>
              <ConfusionMatrix classes={data.evaluation.classes} matrix={data.evaluation.confusion_matrix} />
            </section>
          </>
        )}
        <Disclaimer className="mt-10" />
      </div>
    </>
  )
}
