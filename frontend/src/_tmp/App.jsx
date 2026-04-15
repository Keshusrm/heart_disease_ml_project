import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import DatasetPage from './pages/DatasetPage';
import DashboardPage from './pages/DashboardPage';
import ConfusionMatrixPage from './pages/ConfusionMatrixPage';
import PredictionPage from './pages/PredictionPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-dark-bg">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dataset" element={<DatasetPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/confusion-matrix" element={<ConfusionMatrixPage />} />
            <Route path="/predict" element={<PredictionPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
