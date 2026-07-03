import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listPqr } from '../services/pqrService';
import type { PqrFilters, PqrListItem, PqrListResponse } from '../types/pqr';

const initialFilters: PqrFilters = {
  page: 1,
  limit: 10,
  radicado: '',
  tipo: '',
  estado: '',
  prioridad: '',
  categoria: '',
};

const tipoLabels = {
  peticion: 'Peticion',
  queja: 'Queja',
  reclamo: 'Reclamo',
};

const estadoLabels = {
  recibida: 'Recibida',
  en_gestion: 'En gestion',
  resuelta: 'Resuelta',
  cerrada: 'Cerrada',
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
  }).format(new Date(value));
}

function getSolicitanteName(pqr: PqrListItem) {
  return [pqr.solicitante.nombre, pqr.solicitante.apellido]
    .filter(Boolean)
    .join(' ');
}

export function PqrListPage() {
  const [filters, setFilters] = useState<PqrFilters>(initialFilters);
  const [response, setResponse] = useState<PqrListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    listPqr(filters)
      .then((result) => {
        if (!controller.signal.aborted) {
          setResponse(result);
        }
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          setResponse(null);
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'No fue posible cargar el listado.',
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
  }, [filters]);

  const rows = response?.data ?? [];
  const meta = response?.meta;

  function prepareRequest() {
    setIsLoading(true);
    setError(null);
  }

  function updateFilter(name: keyof PqrFilters, value: string) {
    prepareRequest();
    setFilters((current) => ({
      ...current,
      [name]: value,
      page: 1,
    }));
  }

  function clearFilters() {
    prepareRequest();
    setFilters(initialFilters);
  }

  function changePage(nextPage: number) {
    prepareRequest();
    setFilters((current) => ({
      ...current,
      page: nextPage,
    }));
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Listado</p>
          <h2 className="page-title">PQR registradas</h2>
          <p className="page-description">
            Consulta operativa con filtros por tipo, estado, prioridad,
            categoria y busqueda por radicado.
          </p>
        </div>
        <Link className="primary-button" to="/pqr/nueva">
          Nueva PQR
        </Link>
      </div>

      <section className="panel list-panel">
        <div className="filters-grid">
          <div className="field">
            <label htmlFor="radicado">Radicado</label>
            <input
              id="radicado"
              name="radicado"
              placeholder="PQR-2026-000001"
              type="search"
              value={filters.radicado}
              onChange={(event) => updateFilter('radicado', event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="tipo">Tipo</label>
            <select
              id="tipo"
              name="tipo"
              value={filters.tipo}
              onChange={(event) => updateFilter('tipo', event.target.value)}
              disabled={Boolean(filters.radicado)}
            >
              <option value="">Todos</option>
              <option value="peticion">Peticion</option>
              <option value="queja">Queja</option>
              <option value="reclamo">Reclamo</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={filters.estado}
              onChange={(event) => updateFilter('estado', event.target.value)}
              disabled={Boolean(filters.radicado)}
            >
              <option value="">Todos</option>
              <option value="recibida">Recibida</option>
              <option value="en_gestion">En gestion</option>
              <option value="resuelta">Resuelta</option>
              <option value="cerrada">Cerrada</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="prioridad">Prioridad</label>
            <select
              id="prioridad"
              name="prioridad"
              value={filters.prioridad}
              onChange={(event) => updateFilter('prioridad', event.target.value)}
              disabled={Boolean(filters.radicado)}
            >
              <option value="">Todas</option>
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="categoria">Categoria</label>
            <input
              id="categoria"
              name="categoria"
              placeholder="Atencion"
              type="text"
              value={filters.categoria}
              onChange={(event) => updateFilter('categoria', event.target.value)}
              disabled={Boolean(filters.radicado)}
            />
          </div>

          <div className="filters-actions">
            <button className="secondary-button" type="button" onClick={clearFilters}>
              Limpiar
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="state-box" role="status">
            Cargando PQR registradas...
          </div>
        )}

        {!isLoading && error && (
          <div className="state-box error-state" role="alert">
            {error}
          </div>
        )}

        {!isLoading && !error && rows.length === 0 && (
          <div className="state-box empty-state">
            No hay PQR que coincidan con los filtros seleccionados.
          </div>
        )}

        {!isLoading && !error && rows.length > 0 && (
          <>
            <div className="table-shell">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Radicado</th>
                    <th>Solicitante</th>
                    <th>Tipo</th>
                    <th>Categoria</th>
                    <th>Prioridad</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <Link className="table-link" to={`/pqr/${row.id}`}>
                          {row.radicado}
                        </Link>
                      </td>
                      <td>{getSolicitanteName(row)}</td>
                      <td>{tipoLabels[row.tipo]}</td>
                      <td>{row.categoria}</td>
                      <td>{prioridadLabels[row.prioridad]}</td>
                      <td>
                        <span className={`status-pill status-${row.estado}`}>
                          {estadoLabels[row.estado]}
                        </span>
                      </td>
                      <td>{formatDate(row.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta && (
              <div className="pagination-bar">
                <p>
                  Pagina {meta.page} de {meta.totalPages || 1} · {meta.total}{' '}
                  registros
                </p>
                <div className="pagination-actions">
                  <button
                    className="secondary-button"
                    type="button"
                    disabled={meta.page <= 1 || Boolean(filters.radicado)}
                    onClick={() => changePage(meta.page - 1)}
                  >
                    Anterior
                  </button>
                  <button
                    className="secondary-button"
                    type="button"
                    disabled={
                      meta.page >= meta.totalPages || Boolean(filters.radicado)
                    }
                    onClick={() => changePage(meta.page + 1)}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </section>
  );
}
