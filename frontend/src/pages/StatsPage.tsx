import { useEffect, useState } from 'react';
import { getPqrStats } from '../services/pqrService';
import type { PqrStats } from '../types/pqr';

const estadoCards = [
  { key: 'recibida', label: 'Recibidas', note: 'Solicitudes nuevas' },
  { key: 'en_gestion', label: 'En gestion', note: 'Casos activos' },
  { key: 'resuelta', label: 'Resueltas', note: 'Con respuesta registrada' },
  { key: 'cerrada', label: 'Cerradas', note: 'Finalizadas' },
] as const;

const tipoCards = [
  { key: 'peticion', label: 'Peticiones' },
  { key: 'queja', label: 'Quejas' },
  { key: 'reclamo', label: 'Reclamos' },
] as const;

const prioridadCards = [
  { key: 'baja', label: 'Baja' },
  { key: 'media', label: 'Media' },
  { key: 'alta', label: 'Alta' },
  { key: 'urgente', label: 'Urgente' },
] as const;

function getPercent(value: number, total: number) {
  if (total === 0) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

export function StatsPage() {
  const [stats, setStats] = useState<PqrStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    getPqrStats()
      .then((result) => {
        if (isCurrent) {
          setStats(result);
        }
      })
      .catch((requestError: unknown) => {
        if (isCurrent) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'No fue posible cargar las estadisticas.',
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
  }, []);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Indicadores</p>
          <h2 className="page-title">Estadisticas basicas</h2>
          <p className="page-description">
            Conteos operativos por estado, tipo y prioridad calculados desde las
            PQR registradas.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="state-box" role="status">
          Cargando estadisticas...
        </div>
      )}

      {!isLoading && error && (
        <div className="state-box error-state" role="alert">
          {error}
        </div>
      )}

      {!isLoading && !error && stats?.total === 0 && (
        <div className="state-box empty-state">
          No hay PQR registradas para calcular indicadores.
        </div>
      )}

      {!isLoading && !error && stats && stats.total > 0 && (
        <div className="stats-layout">
          <div className="metrics-grid">
            <article className="metric-card">
              <p className="metric-label">Total PQR</p>
              <p className="metric-value">{stats.total}</p>
              <p className="metric-note">Registros disponibles</p>
            </article>
            {estadoCards.map((card) => (
              <article className="metric-card" key={card.key}>
                <p className="metric-label">{card.label}</p>
                <p className="metric-value">{stats.byEstado[card.key]}</p>
                <p className="metric-note">{card.note}</p>
              </article>
            ))}
          </div>

          <div className="dashboard-grid">
            <section className="panel">
              <div className="panel-header">
                <h3 className="panel-title">Distribucion por tipo</h3>
              </div>
              <div className="bar-list">
                {tipoCards.map((card) => {
                  const value = stats.byTipo[card.key];
                  const percent = getPercent(value, stats.total);

                  return (
                    <div className="bar-row" key={card.key}>
                      <div className="bar-row-header">
                        <span>{card.label}</span>
                        <strong>
                          {value} · {percent}%
                        </strong>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="panel">
              <div className="panel-header">
                <h3 className="panel-title">Distribucion por prioridad</h3>
              </div>
              <div className="bar-list">
                {prioridadCards.map((card) => {
                  const value = stats.byPrioridad[card.key];
                  const percent = getPercent(value, stats.total);

                  return (
                    <div className="bar-row" key={card.key}>
                      <div className="bar-row-header">
                        <span>{card.label}</span>
                        <strong>
                          {value} · {percent}%
                        </strong>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill priority-fill"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      )}
    </section>
  );
}
