import { useEffect, useState } from 'react';
import { Database, FileText, Tag } from 'lucide-react';
import { getMetrics } from '../services/api';

const FEATURES = [
  { name: 'Age', type: 'Numerical', desc: 'Age of the patient in years' },
  { name: 'Sex', type: 'Categorical', desc: 'M = Male, F = Female' },
  { name: 'ChestPainType', type: 'Categorical', desc: 'TA, ATA, NAP, ASY' },
  { name: 'RestingBP', type: 'Numerical', desc: 'Resting blood pressure (mm Hg)' },
  { name: 'Cholesterol', type: 'Numerical', desc: 'Serum cholesterol (mg/dl)' },
  { name: 'FastingBS', type: 'Binary', desc: '1 if fasting blood sugar > 120 mg/dl, else 0' },
  { name: 'RestingECG', type: 'Categorical', desc: 'Normal, ST, LVH' },
  { name: 'MaxHR', type: 'Numerical', desc: 'Maximum heart rate achieved' },
  { name: 'ExerciseAngina', type: 'Categorical', desc: 'Y = Yes, N = No' },
  { name: 'Oldpeak', type: 'Numerical', desc: 'ST depression induced by exercise' },
  { name: 'ST_Slope', type: 'Categorical', desc: 'Up, Flat, Down' },
];

export default function DatasetPage() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    getMetrics()
      .then((res) => setInfo(res.data.dataset_info))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 animate-fade-in-up">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <Database className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Dataset Overview</h1>
          <p className="text-dark-muted">Heart Failure Prediction Dataset</p>
        </div>
      </div>

      {/* Dataset Description */}
      <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-5 h-5 text-primary-400" />
          <h2 className="text-lg font-bold">Description</h2>
        </div>
        <p className="text-dark-muted leading-relaxed">
          This dataset contains 918 patient records with 11 clinical features commonly used in
          cardiovascular risk assessment. The target variable <code className="text-primary-400 bg-primary-500/10 px-1.5 py-0.5 rounded text-sm">HeartDisease</code> indicates
          whether the patient has heart disease (1) or not (0). The dataset combines multiple
          heart disease databases from Cleveland, Hungary, Switzerland, and Long Beach.
        </p>

        {info && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            {[
              { label: 'Total Samples', value: info.total_samples },
              { label: 'Features', value: info.features?.length || 11 },
              { label: 'Positive (Disease)', value: info.positive_cases },
              { label: 'Negative (Healthy)', value: info.negative_cases },
            ].map((stat) => (
              <div key={stat.label} className="p-3 rounded-xl bg-dark-surface/50 border border-dark-border text-center">
                <p className="text-2xl font-bold text-primary-400">{stat.value}</p>
                <p className="text-xs text-dark-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feature Table */}
      <div className="glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="p-6 border-b border-dark-border flex items-center gap-2">
          <Tag className="w-5 h-5 text-accent-400" />
          <h2 className="text-lg font-bold">Feature Description</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-dark-surface/50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-dark-muted uppercase tracking-wider">#</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-dark-muted uppercase tracking-wider">Feature</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-dark-muted uppercase tracking-wider">Type</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-dark-muted uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border/50">
              {FEATURES.map((f, i) => (
                <tr
                  key={f.name}
                  className="hover:bg-dark-surface/30 transition-colors animate-slide-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <td className="px-6 py-4 text-sm text-dark-muted">{i + 1}</td>
                  <td className="px-6 py-4">
                    <code className="text-sm font-medium text-primary-300 bg-primary-500/10 px-2 py-1 rounded">
                      {f.name}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      f.type === 'Numerical' ? 'bg-accent-500/20 text-accent-400' :
                      f.type === 'Binary' ? 'bg-warning-500/20 text-warning-400' :
                      'bg-primary-500/20 text-primary-400'
                    }`}>
                      {f.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-dark-muted">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Target Variable */}
        <div className="p-6 border-t border-dark-border bg-dark-surface/30">
          <h3 className="font-semibold text-sm mb-2">Target Variable</h3>
          <div className="flex items-center gap-4">
            <code className="text-primary-300 bg-primary-500/10 px-2 py-1 rounded text-sm">HeartDisease</code>
            <span className="text-sm text-dark-muted">→</span>
            <span className="text-xs px-2 py-1 rounded-full bg-success-500/20 text-success-400 font-medium">0 = No Disease</span>
            <span className="text-xs px-2 py-1 rounded-full bg-danger-500/20 text-danger-400 font-medium">1 = Heart Disease</span>
          </div>
        </div>
      </div>
    </div>
  );
}
