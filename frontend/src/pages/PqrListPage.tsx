const rows = [
  {
    radicado: 'PQR-2026-000018',
    solicitante: 'Carlos Perez',
    tipo: 'Peticion',
    prioridad: 'Media',
    estado: 'En gestion',
  },
  {
    radicado: 'PQR-2026-000017',
    solicitante: 'Laura Gomez',
    tipo: 'Queja',
    prioridad: 'Alta',
    estado: 'Recibida',
  },
  {
    radicado: 'PQR-2026-000016',
    solicitante: 'Andres Ruiz',
    tipo: 'Reclamo',
    prioridad: 'Urgente',
    estado: 'Resuelta',
  },
];

export function PqrListPage() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Listado</p>
          <h2 className="page-title">PQR registradas</h2>
          <p className="page-description">
            Base visual para conectar filtros por tipo, estado, prioridad y
            categoria.
          </p>
        </div>
      </div>

      <section className="panel">
        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Radicado</th>
                <th>Solicitante</th>
                <th>Tipo</th>
                <th>Prioridad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.radicado}>
                  <td>{row.radicado}</td>
                  <td>{row.solicitante}</td>
                  <td>{row.tipo}</td>
                  <td>{row.prioridad}</td>
                  <td>
                    <span className="status-pill">{row.estado}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
