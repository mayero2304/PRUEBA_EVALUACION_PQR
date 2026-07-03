import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPqrById } from '../services/pqrService';
import type { PqrDetail } from '../types/pqr';

const estadoLabels = {
  recibida: 'Recibida',
  en_gestion: 'En gestion',
  resuelta: 'Resuelta',
  cerrada: 'Cerrada',
};

const tipoLabels = {
  peticion: 'Peticion',
  queja: 'Queja',
  reclamo: 'Reclamo',
};

const prioridadLabels = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
  urgente: 'Urgente',
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function getSolicitanteName(pqr: PqrDetail) {
  return [pqr.solicitante.nombre, pqr.solicitante.apellido]
    .filter(Boolean)
    .join(' ');
}

export function PqrDetailPage() {
  const { id } = useParams();
  const [pqr, setPqr] = useState<PqrDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const missingIdError = !id ? 'No se recibio el identificador de la PQR.' : null;

  useEffect(() => {
    if (!id) {
      return;
    }

    const controller = new AbortController();

    getPqrById(id)
      .then((result) => {
        if (!controller.signal.aborted) {
          setPqr(result);
        }
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'No fue posible cargar el detalle.',
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [id]);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Detalle</p>
          <h2 className="page-title">{pqr?.radicado ?? 'Detalle PQR'}</h2>
          <p className="page-description">
            {pqr?.titulo ??
              'Informacion general, solicitante, estado e historial de acciones.'}
          </p>
        </div>
        <Link className="secondary-button" to="/pqr">
          Volver al listado
        </Link>
      </div>

      {missingIdError && (
        <div className="state-box error-state" role="alert">
          {missingIdError}
        </div>
      )}

      {!missingIdError && isLoading && (
        <div className="state-box" role="status">
          Cargando detalle de la PQR...
        </div>
      )}

      {!missingIdError && !isLoading && error && (
        <div className="state-box error-state" role="alert">
          {error}
        </div>
      )}

      {!missingIdError && !isLoading && !error && pqr && (
        <div className="detail-layout">
          <section className="panel">
            <h3 className="panel-title">Datos principales</h3>
            <table className="data-table detail-table">
              <tbody>
                <tr>
                  <th>Estado</th>
                  <td>
                    <span className={`status-pill status-${pqr.estado}`}>
                      {estadoLabels[pqr.estado]}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th>Tipo</th>
                  <td>{tipoLabels[pqr.tipo]}</td>
                </tr>
                <tr>
                  <th>Prioridad</th>
                  <td>{prioridadLabels[pqr.prioridad]}</td>
                </tr>
                <tr>
                  <th>Categoria</th>
                  <td>{pqr.categoria}</td>
                </tr>
                <tr>
                  <th>Canal</th>
                  <td>{pqr.canal}</td>
                </tr>
                <tr>
                  <th>Solicitante</th>
                  <td>{getSolicitanteName(pqr)}</td>
                </tr>
                <tr>
                  <th>Identificacion</th>
                  <td>{pqr.solicitante.identificacion}</td>
                </tr>
                <tr>
                  <th>Correo</th>
                  <td>{pqr.solicitante.email}</td>
                </tr>
                <tr>
                  <th>Fecha registro</th>
                  <td>{formatDate(pqr.createdAt)}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h3 className="panel-title">Historial</h3>
            </div>
            <div className="timeline">
              {pqr.seguimientos.map((seguimiento) => (
                <article className="timeline-item" key={seguimiento.id}>
                  <span className="timeline-dot" aria-hidden="true" />
                  <div>
                    <p className="timeline-title">
                      {seguimiento.tipoAccion.replaceAll('_', ' ')}
                    </p>
                    <p className="timeline-copy">{seguimiento.descripcion}</p>
                    <p className="timeline-meta">
                      {formatDate(seguimiento.fechaRegistro)}
                      {seguimiento.usuario
                        ? ` · ${seguimiento.usuario.nombre}`
                        : ''}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="panel detail-description">
            <h3 className="panel-title">Descripcion</h3>
            <p>{pqr.descripcion}</p>
          </section>
        </div>
      )}
    </section>
  );
}
