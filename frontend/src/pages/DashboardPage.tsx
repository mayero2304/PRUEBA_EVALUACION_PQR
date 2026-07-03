import { Link } from 'react-router-dom';

const metrics = [
  { label: 'PQR abiertas', value: '18', note: 'Pendientes de cierre' },
  { label: 'En gestion', value: '9', note: 'Asignadas a seguimiento' },
  { label: 'Resueltas', value: '6', note: 'Listas para cierre' },
  { label: 'Urgentes', value: '3', note: 'Prioridad alta' },
];

const recentItems = [
  {
    radicado: 'PQR-2026-000018',
    tipo: 'Peticion',
    categoria: 'Atencion',
    estado: 'En gestion',
  },
  {
    radicado: 'PQR-2026-000017',
    tipo: 'Queja',
    categoria: 'Servicio',
    estado: 'Recibida',
  },
  {
    radicado: 'PQR-2026-000016',
    tipo: 'Reclamo',
    categoria: 'Facturacion',
    estado: 'Resuelta',
  },
];

export function DashboardPage() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Resumen</p>
          <h2 className="page-title">Gestion diaria de PQR</h2>
          <p className="page-description">
            Vista base para monitorear volumen, estados y accesos de trabajo del
            MVP.
          </p>
        </div>
        <Link className="primary-button" to="/pqr/nueva">
          Nueva PQR
        </Link>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <p className="metric-label">{metric.label}</p>
            <p className="metric-value">{metric.value}</p>
            <p className="metric-note">{metric.note}</p>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Ultimos registros</h3>
            <Link className="secondary-button" to="/pqr">
              Ver listado
            </Link>
          </div>
          <div className="table-shell">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Radicado</th>
                  <th>Tipo</th>
                  <th>Categoria</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentItems.map((item) => (
                  <tr key={item.radicado}>
                    <td>{item.radicado}</td>
                    <td>{item.tipo}</td>
                    <td>{item.categoria}</td>
                    <td>
                      <span className="status-pill">{item.estado}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Accesos</h3>
          </div>
          <div className="route-grid">
            <Link className="route-card" to="/pqr">
              <h3>Listado</h3>
              <p>Consulta, filtros y busqueda por radicado.</p>
            </Link>
            <Link className="route-card" to="/pqr/nueva">
              <h3>Registro</h3>
              <p>Formulario publico para crear solicitudes.</p>
            </Link>
            <Link className="route-card" to="/estadisticas">
              <h3>Indicadores</h3>
              <p>Lectura rapida del estado operativo.</p>
            </Link>
            <Link className="route-card" to="/pqr/PQR-2026-000001">
              <h3>Detalle</h3>
              <p>Historial y acciones de gestion.</p>
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
