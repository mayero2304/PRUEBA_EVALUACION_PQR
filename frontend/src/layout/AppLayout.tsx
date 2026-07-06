import {
  BarChart3,
  Bell,
  ClipboardList,
  FilePlus2,
  Home,
  Inbox,
  LogIn,
  LogOut,
  Search,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { API_BASE_URL } from '../lib/api';
import {
  getNotificaciones,
  markNotificacionAsRead,
} from '../services/notificacionesService';
import type { Notificacion } from '../types/notificacion';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
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
  { to: '/dashboard', label: 'Inicio', icon: Home, end: true },
  { to: '/pqr', label: 'Listado PQR', icon: Inbox, end: true },
  { to: '/pqr/nueva', label: 'Nueva PQR', icon: FilePlus2, end: true },
  { to: '/estadisticas', label: 'Estadisticas', icon: BarChart3, end: true },
];

export function AppLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notificacion[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const page = pageTitles[location.pathname] ?? {
    title: 'Detalle PQR',
    subtitle: 'Historial, estado y acciones de gestion de la solicitud.',
  };

  useEffect(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;

    if (!user) {
      return undefined;
    }

    let isCurrent = true;

    getNotificaciones()
      .then((response) => {
        if (isCurrent) {
          setNotifications(response.data);
          setUnreadCount(response.unreadCount);
        }
      })
      .catch(() => undefined);

    const eventSource = new EventSource(
      `${API_BASE_URL}/api/notificaciones/stream`,
      {
        withCredentials: true,
      },
    );
    eventSourceRef.current = eventSource;

    eventSource.addEventListener('notificacion', (event) => {
      const notification = JSON.parse((event as MessageEvent).data) as Notificacion;

      setNotifications((current) => [notification, ...current].slice(0, 10));
      setUnreadCount((current) => current + 1);
    });

    return () => {
      isCurrent = false;
      eventSource.close();
    };
  }, [user]);

  async function handleNotificationRead(notification: Notificacion) {
    if (notification.leida) {
      return;
    }

    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id ? { ...item, leida: true } : item,
      ),
    );
    setUnreadCount((current) => Math.max(current - 1, 0));

    try {
      await markNotificacionAsRead(notification.id);
    } catch {
      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id ? { ...item, leida: false } : item,
        ),
      );
      setUnreadCount((current) => current + 1);
    }
  }

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
            {user && (
              <div className="notifications">
                <button
                  className="icon-button notification-button"
                  type="button"
                  aria-label="Notificaciones"
                  onClick={() =>
                    setIsNotificationsOpen((current) => !current)
                  }
                >
                  <Bell size={18} aria-hidden="true" />
                  {unreadCount > 0 && (
                    <span className="notification-badge">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="notification-menu">
                    <div className="notification-menu-header">
                      <strong>Notificaciones</strong>
                      <span>{unreadCount} sin leer</span>
                    </div>

                    {notifications.length === 0 ? (
                      <p className="notification-empty">Sin novedades.</p>
                    ) : (
                      <div className="notification-list">
                        {notifications.map((notification) => {
                          const content = (
                            <>
                              <span className="notification-title">
                                {notification.titulo}
                              </span>
                              <span className="notification-message">
                                {notification.mensaje}
                              </span>
                            </>
                          );

                          return notification.pqrId ? (
                            <Link
                              className={`notification-item ${
                                notification.leida ? '' : 'unread'
                              }`}
                              key={notification.id}
                              onClick={() => {
                                void handleNotificationRead(notification);
                                setIsNotificationsOpen(false);
                              }}
                              to={`/pqr/${notification.pqrId}`}
                            >
                              {content}
                            </Link>
                          ) : (
                            <button
                              className={`notification-item ${
                                notification.leida ? '' : 'unread'
                              }`}
                              key={notification.id}
                              onClick={() => void handleNotificationRead(notification)}
                              type="button"
                            >
                              {content}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {user ? (
              <div className="session-pill">
                <span>
                  {user.nombre} · {user.rol}
                </span>
                <button type="button" onClick={() => void logout()}>
                  <LogOut size={16} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <Link className="secondary-button" to="/login">
                <LogIn size={16} aria-hidden="true" />
                Login
              </Link>
            )}
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
