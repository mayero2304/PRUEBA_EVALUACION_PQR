import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { ApiError } from '../lib/api';
import {
  createSeguimiento,
  getPqrById,
  updatePqrStatus,
} from '../services/pqrService';
import type { EstadoPqr, PqrDetail, PrioridadPqr } from '../types/pqr';

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

const estadoOptions: EstadoPqr[] = [
  'recibida',
  'en_gestion',
  'resuelta',
  'cerrada',
];

const allowedStatusTransitions: Record<EstadoPqr, EstadoPqr[]> = {
  recibida: ['en_gestion'],
  en_gestion: ['resuelta'],
  resuelta: ['cerrada'],
  cerrada: [],
};

const prioridadOptions: PrioridadPqr[] = ['baja', 'media', 'alta', 'urgente'];

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

function canSelectStatus(currentStatus: EstadoPqr, option: EstadoPqr) {
  return (
    option === currentStatus || allowedStatusTransitions[currentStatus].includes(option)
  );
}

export function PqrDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [pqr, setPqr] = useState<PqrDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusForm, setStatusForm] = useState({
    estado: 'recibida' as EstadoPqr,
    prioridad: 'media' as PrioridadPqr,
    comentario: '',
  });
  const [seguimientoForm, setSeguimientoForm] = useState({
    descripcion: '',
    tipoAccion: 'comentario',
  });
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isCreatingSeguimiento, setIsCreatingSeguimiento] = useState(false);
  const missingIdError = !id ? 'No se recibio el identificador de la PQR.' : null;

  function applyDetail(result: PqrDetail) {
    setPqr(result);
    setStatusForm({
      estado: result.estado,
      prioridad: result.prioridad,
      comentario: '',
    });
  }

  const refreshDetail = useCallback(async () => {
    if (!id) {
      return;
    }

    const result = await getPqrById(id);

    applyDetail(result);
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }

    let isCurrent = true;

    getPqrById(id)
      .then((result) => {
        if (isCurrent) {
          applyDetail(result);
        }
      })
      .catch((requestError: unknown) => {
        if (isCurrent) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'No fue posible cargar el detalle.',
          );
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [id]);

  async function handleStatusSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      return;
    }

    if (!user) {
      setActionError('Debes iniciar sesion para gestionar la PQR.');
      return;
    }

    setIsUpdatingStatus(true);
    setActionError(null);
    setActionMessage(null);

    try {
      await updatePqrStatus(id, {
        estado: statusForm.estado,
        prioridad: statusForm.prioridad,
        comentario: statusForm.comentario.trim() || undefined,
      });
      await refreshDetail();
      setActionMessage('Estado y prioridad actualizados.');
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        setActionError('Sesion requerida. Inicia sesion para continuar.');
        return;
      }

      if (requestError instanceof ApiError && requestError.status === 403) {
        setActionError('Tu rol no tiene permiso para esta accion.');
        return;
      }

      setActionError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible actualizar la PQR.',
      );
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  async function handleSeguimientoSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id || seguimientoForm.descripcion.trim().length < 5) {
      setActionError('El seguimiento debe tener al menos 5 caracteres.');
      return;
    }

    if (!user) {
      setActionError('Debes iniciar sesion para agregar seguimientos.');
      return;
    }

    setIsCreatingSeguimiento(true);
    setActionError(null);
    setActionMessage(null);

    try {
      await createSeguimiento(id, {
        descripcion: seguimientoForm.descripcion.trim(),
        tipoAccion: seguimientoForm.tipoAccion.trim() || 'comentario',
      });
      await refreshDetail();
      setSeguimientoForm({
        descripcion: '',
        tipoAccion: 'comentario',
      });
      setActionMessage('Seguimiento agregado.');
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        setActionError('Sesion requerida. Inicia sesion para continuar.');
        return;
      }

      if (requestError instanceof ApiError && requestError.status === 403) {
        setActionError('Tu rol no tiene permiso para esta accion.');
        return;
      }

      setActionError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible agregar el seguimiento.',
      );
    } finally {
      setIsCreatingSeguimiento(false);
    }
  }

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

          <section className="panel action-panel">
            <h3 className="panel-title">Cambiar estado</h3>
            {!user && (
              <p className="auth-required">
                Inicia sesion para habilitar acciones internas.
              </p>
            )}
            <form className="form-grid" onSubmit={handleStatusSubmit}>
              <div className="field">
                <label htmlFor="estado">Estado</label>
                <select
                  id="estado"
                  value={statusForm.estado}
                  onChange={(event) =>
                    setStatusForm((current) => ({
                      ...current,
                      estado: event.target.value as EstadoPqr,
                    }))
                  }
                >
                  {estadoOptions.map((estado) => (
                    <option
                      disabled={!canSelectStatus(pqr.estado, estado)}
                      key={estado}
                      value={estado}
                    >
                      {estadoLabels[estado]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="prioridad">Prioridad</label>
                <select
                  id="prioridad"
                  value={statusForm.prioridad}
                  onChange={(event) =>
                    setStatusForm((current) => ({
                      ...current,
                      prioridad: event.target.value as PrioridadPqr,
                    }))
                  }
                >
                  {prioridadOptions.map((prioridad) => (
                    <option key={prioridad} value={prioridad}>
                      {prioridadLabels[prioridad]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field full">
                <label htmlFor="comentario">Comentario</label>
                <textarea
                  id="comentario"
                  value={statusForm.comentario}
                  onChange={(event) =>
                    setStatusForm((current) => ({
                      ...current,
                      comentario: event.target.value,
                    }))
                  }
                />
              </div>
              <button
                className="primary-button"
                type="submit"
                disabled={isUpdatingStatus || !user}
              >
                {isUpdatingStatus ? 'Actualizando...' : 'Actualizar PQR'}
              </button>
            </form>
          </section>

          <section className="panel action-panel">
            <h3 className="panel-title">Agregar seguimiento</h3>
            {!user && (
              <p className="auth-required">
                Inicia sesion para registrar comentarios internos.
              </p>
            )}
            <form className="form-grid" onSubmit={handleSeguimientoSubmit}>
              <div className="field">
                <label htmlFor="tipoAccion">Tipo de accion</label>
                <input
                  id="tipoAccion"
                  type="text"
                  value={seguimientoForm.tipoAccion}
                  onChange={(event) =>
                    setSeguimientoForm((current) => ({
                      ...current,
                      tipoAccion: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="field full">
                <label htmlFor="descripcionSeguimiento">Descripcion</label>
                <textarea
                  id="descripcionSeguimiento"
                  value={seguimientoForm.descripcion}
                  onChange={(event) =>
                    setSeguimientoForm((current) => ({
                      ...current,
                      descripcion: event.target.value,
                    }))
                  }
                />
              </div>
              <button
                className="primary-button"
                type="submit"
                disabled={isCreatingSeguimiento || !user}
              >
                {isCreatingSeguimiento ? 'Agregando...' : 'Agregar seguimiento'}
              </button>
            </form>
          </section>

          {(actionError || actionMessage) && (
            <div
              className={`state-box detail-feedback ${
                actionError ? 'error-state' : 'success-state'
              }`}
              role={actionError ? 'alert' : 'status'}
            >
              {actionError ?? actionMessage}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
