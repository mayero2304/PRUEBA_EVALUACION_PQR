import { useParams } from 'react-router-dom';

const timeline = [
  {
    title: 'PQR recibida',
    copy: 'Registro inicial creado con estado recibida.',
  },
  {
    title: 'Seguimiento interno',
    copy: 'Entrada disponible para comentarios de gestion.',
  },
  {
    title: 'Cambio de estado',
    copy: 'Accion preparada para avanzar el flujo definido.',
  },
];

export function PqrDetailPage() {
  const { id } = useParams();

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Detalle</p>
          <h2 className="page-title">{id ?? 'PQR'}</h2>
          <p className="page-description">
            Vista base para integrar informacion general, historial y acciones.
          </p>
        </div>
      </div>

      <div className="detail-layout">
        <section className="panel">
          <h3 className="panel-title">Datos principales</h3>
          <table className="data-table">
            <tbody>
              <tr>
                <th>Estado</th>
                <td>
                  <span className="status-pill">Recibida</span>
                </td>
              </tr>
              <tr>
                <th>Prioridad</th>
                <td>Media</td>
              </tr>
              <tr>
                <th>Categoria</th>
                <td>Atencion</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h3 className="panel-title">Historial</h3>
          </div>
          <div className="timeline">
            {timeline.map((item) => (
              <article className="timeline-item" key={item.title}>
                <span className="timeline-dot" aria-hidden="true" />
                <div>
                  <p className="timeline-title">{item.title}</p>
                  <p className="timeline-copy">{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
