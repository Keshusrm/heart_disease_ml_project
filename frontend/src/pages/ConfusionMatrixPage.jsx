import { useEffect, useState } from 'react';
import { Grid3X3 } from 'lucide-react';
import { getConfusionMatrix } from '../services/api';

const CELL_COLORS = {
  tn: { bg: 'bg-success-500/20', border: 'border-success-500/30', text: 'text-success-400' },
  tp: { bg: 'bg-success-500/30', border: 'border-success-500/40', text: 'text-success-400' },
  fp: { bg: 'bg-danger-500/20', border: 'border-danger-500/30', text: 'text-danger-400' },
  fn: { bg: 'bg-danger-500/20', border: 'border-danger-500/30', text: 'text-danger-400' },
};

function ConfusionMatrixCard({ name, matrix }) {
  const [[tn, fp], [fn, tp]] = matrix;
  const total = tn + fp + fn + tp;

  const cells = [
    { value: tn, label: 'TN', pct: ((tn / total) * 100).toFixed(1), style: CELL_COLORS.tn, row: 0, col: 0 },
    { value: fp, label: 'FP', pct: ((fp / total) * 100).toFixed(1), style: CELL_COLORS.fp, row: 0, col: 1 },
    { value: fn, label: 'FN', pct: ((fn / total) * 100).toFixed(1), style: CELL_COLORS.fn, row: 1, col: 0 },
    { value: tp, label: 'TP', pct: ((tp / total) * 100).toFixed(1), style: CELL_COLORS.tp, row: 1, col: 1 },
  ];

  return (
    <div className="glass-card-hover p-6">
      <h3 className="font-bold text-base mb-4 text-center">{name}</h3>

      {/* Axis Labels */}
      <div className="flex justify-center mb-2">
        <span className="text-xs text-dark-muted font-medium">Predicted</span>
      </div>

      <div className="flex items-center justify-center gap-2">
        <div className="flex flex-col items-center justify-center -mr-1">
          <span className="text-xs text-dark-muted font-medium [writing-mode:vertical-rl] rotate-180">Actual</span>
        </div>

        <div className="grid grid-cols-3 gap-0">
          {/* Column headers */}
          <div />
          <div className="text-center text-xs text-dark-muted font-medium pb-2">No (0)</div>
          <div className="text-center text-xs text-dark-muted font-medium pb-2">Yes (1)</div>

          {/* Row 0 */}
          <div className="text-right text-xs text-dark-muted font-medium pr-3 flex items-center justify-end">No (0)</div>
          {cells.filter(c => c.row === 0).map((c) => (
            <div
              key={c.label}
              className={`w-20 h-20 ${c.style.bg} border ${c.style.border} rounded-xl flex flex-col items-center justify-center m-1 transition-all hover:scale-105`}
            >
              <span className={`text-2xl font-bold ${c.style.text}`}>{c.value}</span>
              <span className="text-[10px] text-dark-muted">{c.label} ({c.pct}%)</span>
            </div>
          ))}

          {/* Row 1 */}
          <div className="text-right text-xs text-dark-muted font-medium pr-3 flex items-center justify-end">Yes (1)</div>
          {cells.filter(c => c.row === 1).map((c) => (
            <div
              key={c.label}
              className={`w-20 h-20 ${c.style.bg} border ${c.style.border} rounded-xl flex flex-col items-center justify-center m-1 transition-all hover:scale-105`}
            >
              <span className={`text-2xl font-bold ${c.style.text}`}>{c.value}</span>
              <span className="text-[10px] text-dark-muted">{c.label} ({c.pct}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs">
        <span className="text-success-400">Correct: {tn + tp} ({(((tn + tp) / total) * 100).toFixed(1)}%)</span>
        <span className="text-dark-border">|</span>
        <span className="text-danger-400">Errors: {fp + fn} ({(((fp + fn) / total) * 100).toFixed(1)}%)</span>
      </div>
    </div>
  );
}

export default function ConfusionMatrixPage() {
  const [matrices, setMatrices] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConfusionMatrix()
      .then((res) => {
        setMatrices(res.data.confusion_matrices);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!matrices) return <p className="text-dark-muted">Failed to load confusion matrices.</p>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 animate-fade-in-up">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <Grid3X3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Confusion Matrices</h1>
          <p className="text-dark-muted">Prediction accuracy breakdown per model</p>
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card p-4 flex flex-wrap items-center gap-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <span className="text-sm text-dark-muted font-medium">Legend:</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-success-500/30 border border-success-500/40" />
          <span className="text-xs text-dark-muted">True Positive / True Negative (Correct)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-danger-500/20 border border-danger-500/30" />
          <span className="text-xs text-dark-muted">False Positive / False Negative (Misclassified)</span>
        </div>
      </div>

      {/* Matrices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.entries(matrices).map(([name, matrix], i) => (
          <div key={name} className="animate-fade-in-up" style={{ animationDelay: `${(i + 1) * 100}ms` }}>
            <ConfusionMatrixCard name={name} matrix={matrix} />
          </div>
        ))}
      </div>
    </div>
  );
}
