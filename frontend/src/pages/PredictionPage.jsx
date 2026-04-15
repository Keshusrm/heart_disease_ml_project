import { useState } from 'react';
import { Stethoscope, AlertTriangle, CheckCircle2, Loader2, Heart } from 'lucide-react';
import { postPredict } from '../services/api';

const FORM_FIELDS = [
  { name: 'Age', type: 'number', label: 'Age', placeholder: 'e.g. 55', min: 1, max: 120 },
  {
    name: 'Sex', type: 'select', label: 'Sex',
    options: [{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }],
  },
  {
    name: 'ChestPainType', type: 'select', label: 'Chest Pain Type',
    options: [
      { value: 'ATA', label: 'ATA - Atypical Angina' },
      { value: 'NAP', label: 'NAP - Non-Anginal Pain' },
      { value: 'ASY', label: 'ASY - Asymptomatic' },
      { value: 'TA', label: 'TA - Typical Angina' },
    ],
  },
  { name: 'RestingBP', type: 'number', label: 'Resting Blood Pressure (mm Hg)', placeholder: 'e.g. 140', min: 0, max: 300 },
  { name: 'Cholesterol', type: 'number', label: 'Cholesterol (mg/dl)', placeholder: 'e.g. 250', min: 0, max: 700 },
  {
    name: 'FastingBS', type: 'select', label: 'Fasting Blood Sugar > 120 mg/dl',
    options: [{ value: 0, label: 'No (0)' }, { value: 1, label: 'Yes (1)' }],
  },
  {
    name: 'RestingECG', type: 'select', label: 'Resting ECG',
    options: [
      { value: 'Normal', label: 'Normal' },
      { value: 'ST', label: 'ST-T Wave Abnormality' },
      { value: 'LVH', label: 'Left Ventricular Hypertrophy' },
    ],
  },
  { name: 'MaxHR', type: 'number', label: 'Max Heart Rate', placeholder: 'e.g. 150', min: 50, max: 250 },
  {
    name: 'ExerciseAngina', type: 'select', label: 'Exercise-Induced Angina',
    options: [{ value: 'N', label: 'No' }, { value: 'Y', label: 'Yes' }],
  },
  { name: 'Oldpeak', type: 'number', label: 'Oldpeak (ST Depression)', placeholder: 'e.g. 1.5', step: 0.1, min: -5, max: 10 },
  {
    name: 'ST_Slope', type: 'select', label: 'ST Slope',
    options: [
      { value: 'Up', label: 'Upsloping' },
      { value: 'Flat', label: 'Flat' },
      { value: 'Down', label: 'Downsloping' },
    ],
  },
];

const INITIAL_VALUES = {
  Age: '', Sex: 'M', ChestPainType: 'ATA', RestingBP: '', Cholesterol: '',
  FastingBS: 0, RestingECG: 'Normal', MaxHR: '', ExerciseAngina: 'N',
  Oldpeak: '', ST_Slope: 'Up',
};

export default function PredictionPage() {
  const [form, setForm] = useState({ ...INITIAL_VALUES });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    const payload = {
      ...form,
      Age: Number(form.Age),
      RestingBP: Number(form.RestingBP),
      Cholesterol: Number(form.Cholesterol),
      FastingBS: Number(form.FastingBS),
      MaxHR: Number(form.MaxHR),
      Oldpeak: Number(form.Oldpeak),
    };

    try {
      const res = await postPredict(payload);
      setResults(res.data.predictions);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed. Check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ ...INITIAL_VALUES });
    setResults(null);
    setError(null);
  };

  // Majority vote
  const majorityResult = results
    ? results.filter((r) => !r.error).reduce(
        (acc, r) => {
          acc[r.prediction] = (acc[r.prediction] || 0) + 1;
          return acc;
        },
        {}
      )
    : null;

  const finalPrediction = majorityResult
    ? Number(Object.entries(majorityResult).sort((a, b) => b[1] - a[1])[0][0])
    : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 animate-fade-in-up">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Heart Disease Prediction</h1>
          <p className="text-dark-muted">Enter patient data for risk assessment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="xl:col-span-2 space-y-6">
          <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-lg font-bold mb-5">Patient Health Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {FORM_FIELDS.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-dark-muted mb-1.5">
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={form[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className="w-full px-3 py-2.5 bg-dark-surface border border-dark-border rounded-xl text-dark-text text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                    >
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      value={form[field.name]}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      step={field.step || 1}
                      min={field.min}
                      max={field.max}
                      required
                      className="w-full px-3 py-2.5 bg-dark-surface border border-dark-border rounded-xl text-dark-text text-sm placeholder:text-dark-border focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-semibold hover:from-primary-500 hover:to-accent-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  Predict Heart Disease
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-dark-surface border border-dark-border text-dark-muted rounded-xl font-medium hover:bg-dark-border/50 hover:text-dark-text transition-all"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Final Result */}
          {results && finalPrediction !== null && (
            <div
              className={`glass-card p-6 animate-fade-in-up text-center ${
                finalPrediction === 1
                  ? 'border-danger-500/50 bg-gradient-to-br from-danger-500/10 to-transparent'
                  : 'border-success-500/50 bg-gradient-to-br from-success-500/10 to-transparent'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                finalPrediction === 1 ? 'bg-danger-500/20' : 'bg-success-500/20'
              }`}>
                {finalPrediction === 1 ? (
                  <AlertTriangle className="w-8 h-8 text-danger-400" />
                ) : (
                  <CheckCircle2 className="w-8 h-8 text-success-400" />
                )}
              </div>
              <h3 className={`text-xl font-bold mb-2 ${
                finalPrediction === 1 ? 'text-danger-400' : 'text-success-400'
              }`}>
                {finalPrediction === 1 ? 'Heart Disease Detected' : 'No Heart Disease'}
              </h3>
              <p className="text-sm text-dark-muted">
                Consensus: {majorityResult[finalPrediction]}/{results.filter(r => !r.error).length} models agree
              </p>
            </div>
          )}

          {/* Per-model Results */}
          {results && (
            <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <h3 className="font-bold mb-4">Model-wise Results</h3>
              <div className="space-y-3">
                {results.filter(r => !r.error).map((r) => (
                  <div
                    key={r.model}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      r.prediction === 1
                        ? 'bg-danger-500/10 border-danger-500/30'
                        : 'bg-success-500/10 border-success-500/30'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium">{r.model}</p>
                      <p className="text-xs text-dark-muted">
                        Probability: {(r.probability * 100).toFixed(1)}%
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      r.prediction === 1
                        ? 'bg-danger-500/20 text-danger-400'
                        : 'bg-success-500/20 text-success-400'
                    }`}>
                      {r.prediction === 1 ? 'POSITIVE' : 'NEGATIVE'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="glass-card p-4 border-danger-500/50 bg-danger-500/10 animate-fade-in-up">
              <p className="text-danger-400 text-sm">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!results && !error && (
            <div className="glass-card p-8 text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <Stethoscope className="w-12 h-12 text-dark-border mx-auto mb-3" />
              <p className="text-dark-muted text-sm">
                Fill in the patient parameters and click <strong>Predict</strong> to see results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
