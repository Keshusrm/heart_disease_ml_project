import { useEffect, useState } from 'react';
import { Heart, Activity, Users, TrendingUp, Brain, Zap } from 'lucide-react';
import { getMetrics } from '../services/api';
import StatsCard from '../components/StatsCard';

export default function HomePage() {
  const [datasetInfo, setDatasetInfo] = useState(null);

  useEffect(() => {
    getMetrics()
      .then((res) => setDatasetInfo(res.data.dataset_info))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl glass-card p-8 md:p-12 animate-fade-in-up">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 via-transparent to-accent-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center animate-pulse-glow">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="px-3 py-1 text-xs font-medium bg-primary-500/20 text-primary-300 rounded-full border border-primary-500/30">
                Machine Learning
              </span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 gradient-text leading-tight">
            Heart Disease<br />Prediction System
          </h1>
          <p className="text-lg text-dark-muted max-w-2xl leading-relaxed">
            An intelligent clinical decision support system powered by 5 supervised machine learning
            models. Analyzes 11 key patient health indicators to predict heart disease risk
            with high accuracy.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      {datasetInfo && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            icon={Users}
            label="Total Patients"
            value={datasetInfo.total_samples}
            color="primary"
            delay={0}
          />
          <StatsCard
            icon={Activity}
            label="Positive Cases"
            value={datasetInfo.positive_cases}
            color="danger"
            delay={100}
          />
          <StatsCard
            icon={Heart}
            label="Negative Cases"
            value={datasetInfo.negative_cases}
            color="success"
            delay={200}
          />
          <StatsCard
            icon={Brain}
            label="ML Models"
            value="5"
            color="accent"
            delay={300}
          />
        </div>
      )}

      {/* Objective Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card-hover p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-400" />
            </div>
            <h2 className="text-xl font-bold">Objective</h2>
          </div>
          <p className="text-dark-muted leading-relaxed">
            Predict the likelihood of heart disease in patients using supervised classification
            algorithms. The system compares 5 different ML models — Logistic Regression,
            Decision Tree, Random Forest, SVM, and KNN — evaluating them on accuracy, precision,
            recall, F1-score, and ROC-AUC to determine the best-performing model.
          </p>
        </div>

        <div className="glass-card-hover p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-accent-400" />
            </div>
            <h2 className="text-xl font-bold">Methodology</h2>
          </div>
          <ul className="text-dark-muted space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
              Data preprocessing with label encoding &amp; feature scaling
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
              80/20 stratified train-test split
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
              5-fold cross-validation for robust evaluation
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
              Comprehensive metrics: Accuracy, Precision, Recall, F1 &amp; ROC-AUC
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
              Real-time prediction via REST API
            </li>
          </ul>
        </div>
      </div>

      {/* Models Overview */}
      <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <h2 className="text-xl font-bold mb-5">Models Used</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { name: 'Logistic Regression', desc: 'Linear classifier with probabilistic output' },
            { name: 'Decision Tree', desc: 'Rule-based tree structure classifier' },
            { name: 'Random Forest', desc: 'Ensemble of decision trees' },
            { name: 'SVM', desc: 'Hyperplane-based margin classifier' },
            { name: 'KNN', desc: 'Instance-based nearest neighbor' },
          ].map((model, i) => (
            <div
              key={model.name}
              className="p-4 rounded-xl bg-dark-surface/50 border border-dark-border hover:border-primary-500/40 transition-all duration-300 hover:bg-dark-surface"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center mb-3">
                <span className="text-sm font-bold text-primary-400">{i + 1}</span>
              </div>
              <h3 className="font-semibold text-sm mb-1">{model.name}</h3>
              <p className="text-xs text-dark-muted">{model.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
