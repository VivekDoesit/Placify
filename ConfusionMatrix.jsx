// Renders the real confusion matrix from evaluation.json (rows = actual, columns = predicted).
export default function ConfusionMatrix({ classes, matrix }) {
  const total = matrix.flat().reduce((a, b) => a + b, 0)
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] border-separate border-spacing-2 text-center text-sm">
        <caption className="sr-only">Confusion matrix on the held-out test set</caption>
        <thead>
          <tr>
            <td />
            <th scope="col" colSpan={classes.length} className="pb-1 text-xs font-bold text-navy-80">Predicted</th>
          </tr>
          <tr>
            <td />
            {classes.map((c) => <th key={c} scope="col" className="font-bold">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={classes[i]}>
              <th scope="row" className="pr-1 text-left font-bold">
                <span className="block text-xs text-navy-80">Actual</span>{classes[i]}
              </th>
              {row.map((count, j) => {
                const correct = i === j
                return (
                  <td key={j} className={`rounded-xl px-3 py-5 ${correct ? 'bg-navy text-cream-light' : 'border border-brown/40 bg-cream-light text-navy'}`}>
                    <span className="block text-2xl font-extrabold tabular-nums">{count}</span>
                    <span className="block text-xs">{correct ? 'correct' : 'incorrect'} · {((count / total) * 100).toFixed(1)}%</span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
