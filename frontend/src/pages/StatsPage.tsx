const stats = [
  { label: 'Recibidas', value: '12', note: 'Solicitudes nuevas' },
  { label: 'En gestion', value: '9', note: 'Casos activos' },
  { label: 'Resueltas', value: '6', note: 'Pendientes de cierre' },
  { label: 'Cerradas', value: '4', note: 'Finalizadas' },
];

export function StatsPage() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Indicadores</p>
          <h2 className="page-title">Estadisticas basicas</h2>
          <p className="page-description">
            Base visual para conectar resumen por estado, tipo y prioridad.
          </p>
        </div>
      </div>

      <div className="metrics-grid">
        {stats.map((stat) => (
          <article className="metric-card" key={stat.label}>
            <p className="metric-label">{stat.label}</p>
            <p className="metric-value">{stat.value}</p>
            <p className="metric-note">{stat.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
