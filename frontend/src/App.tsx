import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { CreatePqrPage } from './pages/CreatePqrPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { PqrDetailPage } from './pages/PqrDetailPage';
import { PqrListPage } from './pages/PqrListPage';
import { PublicPqrPage } from './pages/PublicPqrPage';
import { StatsPage } from './pages/StatsPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route index element={<PublicPqrPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="pqr" element={<PqrListPage />} />
        <Route path="pqr/nueva" element={<CreatePqrPage />} />
        <Route path="pqr/:id" element={<PqrDetailPage />} />
        <Route path="estadisticas" element={<StatsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
