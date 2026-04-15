import { NavLink } from 'react-router-dom';
import {
  Home, Database, BarChart3, Grid3X3, Stethoscope, Activity, Heart
} from 'lucide-react';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/dataset', icon: Database, label: 'Dataset' },
  { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { path: '/confusion-matrix', icon: Grid3X3, label: 'Confusion Matrix' },
  { path: '/predict', icon: Stethoscope, label: 'Prediction' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-dark-card border-r border-dark-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">CardioPredict</h1>
            <p className="text-xs text-dark-muted">ML Heart Analysis</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                  : 'text-dark-muted hover:text-dark-text hover:bg-dark-surface/50'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-border">
        <div className="glass-card p-3 text-center">
          <Activity className="w-5 h-5 text-primary-400 mx-auto mb-1" />
          <p className="text-xs text-dark-muted">5 ML Models Active</p>
        </div>
      </div>
    </aside>
  );
}
