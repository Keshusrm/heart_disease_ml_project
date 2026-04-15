export default function StatsCard({ icon: Icon, label, value, color = 'primary', delay = 0 }) {
  const colorMap = {
    primary: 'from-primary-500/20 to-primary-600/10 border-primary-500/30 text-primary-400',
    accent: 'from-accent-500/20 to-accent-600/10 border-accent-500/30 text-accent-400',
    success: 'from-success-500/20 to-success-400/10 border-success-500/30 text-success-400',
    danger: 'from-danger-500/20 to-danger-400/10 border-danger-500/30 text-danger-400',
    warning: 'from-warning-500/20 to-warning-400/10 border-warning-500/30 text-warning-400',
  };

  return (
    <div
      className={`glass-card-hover p-5 bg-gradient-to-br ${colorMap[color]} animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-dark-muted mb-1">{label}</p>
          <p className="text-2xl font-bold text-dark-text">{value}</p>
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
