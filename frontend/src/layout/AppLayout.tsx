import {
  BarChart3,
  Bell,
  ClipboardList,
  FilePlus2,
  Home,
  Inbox,
  Search,
} from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Panel operativo',
    subtitle: 'Resumen de actividad y accesos principales del MVP PQR.',
  },
  '/pqr': {
    title: 'PQR registradas',
    subtitle: 'Listado de solicitudes con filtros y busqueda por radicado.',
  },
  '/pqr/nueva': {
    title: 'Registrar PQR',
    subtitle: 'Captura inicial de la solicitud y datos del solicitante.',
  },
  '/estadisticas': {
    title: 'Estadisticas',
    subtitle: 'Indicadores basicos para seguimiento de volumen y estados.',
  },
};

const navItems = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/pqr', label: 'Listado PQR', icon: Inbox },
  { to: '/pqr/nueva', label: 'Nueva PQR', icon: FilePlus2 },
  { to: '/estadisticas', label: 'Estadisticas', icon: BarChart3 },
];

export function AppLayout() {
  const location = useLocation();
  const page = pageTitles[location.pathname] ?? {
    title: 'Detalle PQR',
    subtitle: 'Historial, estado y acciones de gestion de la solicitud.',
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand" aria-label="PRUEBA EVALUACION PQR">
          <div className="brand-mark">PQ</div>
          <div>
            <p className="brand-title">PRUEBA_EVALUACION_PQR</p>
            <p className="brand-subtitle">Gestion de solicitudes</p>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Navegacion principal">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                className="nav-link"
                end={item.end}
                key={item.to}
                to={item.to}
              >
                <Icon className="nav-icon" aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <ClipboardList className="nav-icon" aria-hidden="true" />
          <p>Flujo: recibida, en gestion, resuelta y cerrada.</p>
        </div>
      </aside>

      <div className="content-shell">
        <header className="topbar">
          <div>
            <h1 className="topbar-title">{page.title}</h1>
            <p className="topbar-subtitle">{page.subtitle}</p>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={18} aria-hidden="true" />
              <input type="search" placeholder="Buscar radicado" />
            </label>
            <button className="icon-button" type="button" aria-label="Notificaciones">
              <Bell size={18} aria-hidden="true" />
            </button>
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
