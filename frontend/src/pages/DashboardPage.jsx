import { useEffect, useState } from 'react';
import { BarChart3, Trophy, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { getMetrics, getRocData, getFeatureImportance } from '../services/api';

const COLORS = ['#3b82f6', '#0ea5e9', '#8b5cf6', '#22c55e', '#f59e0b'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 text-sm">
      <p className="font-semibold text-dark-text mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="text-xs">
          {p.name}: {typeof p.value === 'number' ? (p.value * 100).toFixed(1) + '%' : p.value}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [rocData, setRocData] = useState(null);
  const [featureImp, setFeatureImp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMetrics(), getRocData(), getFeatureImportance()])
      .then(([metricsRes, rocRes, fiRes]) => {
        setMetrics(metricsRes.data.metrics);
        setRocData(rocRes.data.roc_data);
        setFeatureImp(fiRes.data.feature_importance);
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

  if (!metrics) return <p className="text-dark-muted">Failed to load metrics.</p>;

  // ---- Prepare comparison data ----
  const comparisonData = Object.entries(metrics).map(([name, m]) => ({
    name: name.replace('Logistic Regression', 'Log. Reg.'),
    fullName: name,
    Accuracy: m.accuracy,
    Precision: m.precision,
    Recall: m.recall,
    'F1 Score': m.f1_score,
    'ROC-AUC': m.roc_auc,
    'Cross-Val': m.cross_val_mean,
  }));

  // ---- Ranking ----
  const ranked = [...Object.entries(metrics)]
    .sort((a, b) => b[1].accuracy - a[1].accuracy)
    .map(([name, m], i) => ({ rank: i + 1, name, ...m }));

  // ---- ROC Chart Data ----
  const rocChartData = [];
  if (rocData) {
    const modelNames = Object.keys(rocData);
    const maxLen = Math.max(...modelNames.map((n) => rocData[n].fpr.length));
    for (let i = 0; i < maxLen; i += Math.max(1, Math.floor(maxLen / 100))) {
      const point = {};
      modelNames.forEach((n) => {
        const idx = Math.min(i, rocData[n].fpr.length - 1);
        point[`${n}_fpr`] = rocData[n].fpr[idx];
        point[n] = rocData[n].tpr[idx];
      });
      point.fpr = modelNames.reduce((sum, n) => {
        const idx = Math.min(i, rocData[n].fpr.length - 1);
        return sum + rocData[n].fpr[idx];
      }, 0) / modelNames.length;
      rocChartData.push(point);
    }
    rocChartData.sort((a, b) => a.fpr - b.fpr);
  }

  // ---- Feature Importance Data ----
  const fiData = featureImp
    ? featureImp.features
        .map((f, i) => ({ name: f, importance: featureImp.importance[i] }))
        .sort((a, b) => b.importance - a.importance)
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 animate-fade-in-up">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Model Performance Dashboard</h1>
          <p className="text-dark-muted">Compare ML model metrics side-by-side</p>
        </div>
      </div>

      {/* Model Ranking Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        {ranked.map((m, i) => (
          <div
            key={m.name}
            className={`glass-card-hover p-4 ${i === 0 ? 'border-warning-500/50 bg-gradient-to-br from-warning-500/10 to-transparent' : ''}`}
          >
            <div className="flex items-center gap-2 mb-2">
              {i === 0 && <Trophy className="w-4 h-4 text-warning-400" />}
              <span className={`text-xs font-bold ${i === 0 ? 'text-warning-400' : 'text-dark-muted'}`}>
                #{m.rank}
              </span>
            </div>
            <h3 className="font-semibold text-sm mb-2">{m.name}</h3>
            <p className="text-2xl font-bold text-primary-400">{(m.accuracy * 100).toFixed(1)}%</p>
            <p className="text-xs text-dark-muted mt-1">Accuracy</p>
          </div>
        ))}
      </div>

      {/* Metrics Comparison Table */}
      <div className="glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="p-6 border-b border-dark-border">
          <h2 className="text-lg font-bold">Metrics Comparison Table</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-surface/50">
                {['Model', 'Accuracy', 'Precision', 'Recall', 'F1 Score', 'ROC-AUC', 'Cross-Val'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-dark-muted uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/50">
              {ranked.map((m) => (
                <tr key={m.name} className="hover:bg-dark-surface/30 transition-colors">
                  <td className="px-6 py-4 font-medium">{m.name}</td>
                  {['accuracy', 'precision', 'recall', 'f1_score', 'roc_auc', 'cross_val_mean'].map((key) => (
                    <td key={key} className="px-6 py-4">
                      <span className={`text-sm font-mono ${m[key] >= 0.85 ? 'text-success-400' : m[key] >= 0.75 ? 'text-warning-400' : 'text-danger-400'}`}>
                        {(m[key] * 100).toFixed(2)}%
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Model Comparison */}
        <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-lg font-bold mb-4">Metric Comparison</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={comparisonData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[0.5, 1]} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Accuracy" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="F1 Score" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ROC-AUC" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ROC Curve */}
        <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-lg font-bold mb-4">ROC Curves</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="fpr"
                type="number"
                domain={[0, 1]}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'False Positive Rate', position: 'bottom', fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis
                domain={[0, 1]}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {rocData &&
                Object.keys(rocData).map((name, i) => (
                  <Line
                    key={name}
                    data={rocData[name].fpr.map((fpr, j) => ({
                      fpr,
                      [name]: rocData[name].tpr[j],
                    }))}
                    dataKey={name}
                    name={`${name} (${rocData[name].auc})`}
                    stroke={COLORS[i % COLORS.length]}
                    dot={false}
                    strokeWidth={2}
                  />
                ))}
              {/* Diagonal reference line */}
              <Line
                data={[{ fpr: 0, Random: 0 }, { fpr: 1, Random: 1 }]}
                dataKey="Random"
                name="Random (0.5)"
                stroke="#475569"
                strokeDasharray="5 5"
                dot={false}
                strokeWidth={1}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Importance */}
      {fiData.length > 0 && (
        <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-bold">Feature Importance (Random Forest)</h2>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={fiData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={(v) => v.toFixed(2)} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="importance" fill="url(#fiGradient)" radius={[0, 6, 6, 0]} />
              <defs>
                <linearGradient id="fiGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
