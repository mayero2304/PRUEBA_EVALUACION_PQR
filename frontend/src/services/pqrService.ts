import { apiClient } from '../lib/api';
import type {
  CreatePqrPayload,
  CreatePqrResponse,
  CreateSeguimientoPayload,
  EstadoPqr,
  PqrDetail,
  PqrFilters,
  PqrListItem,
  PqrListResponse,
  PqrStats,
  PrioridadPqr,
  TipoPqr,
  UpdatePqrStatusPayload,
  UpdatePqrStatusResponse,
} from '../types/pqr';

function buildQuery(filters: PqrFilters) {
  const params = new URLSearchParams({
    page: String(filters.page),
    limit: String(filters.limit),
  });

  if (filters.tipo) {
    params.set('tipo', filters.tipo);
  }

  if (filters.estado) {
    params.set('estado', filters.estado);
  }

  if (filters.prioridad) {
    params.set('prioridad', filters.prioridad);
  }

  if (filters.categoria.trim()) {
    params.set('categoria', filters.categoria.trim());
  }

  return params.toString();
}

export async function listPqr(filters: PqrFilters): Promise<PqrListResponse> {
  const radicado = filters.radicado.trim();

  if (radicado) {
    const pqr = await apiClient.get<PqrListItem>(
      `/api/pqr/buscar?radicado=${encodeURIComponent(radicado)}`,
    );

    return {
      data: [pqr],
      meta: {
        page: 1,
        limit: 1,
        total: 1,
        totalPages: 1,
      },
    };
  }

  return apiClient.get<PqrListResponse>(`/api/pqr?${buildQuery(filters)}`);
}

export function createPqr(payload: CreatePqrPayload) {
  return apiClient.post<CreatePqrResponse>('/api/pqr', payload);
}

export function getPqrById(id: string) {
  return apiClient.get<PqrDetail>(`/api/pqr/${id}`);
}

export function updatePqrStatus(id: string, payload: UpdatePqrStatusPayload) {
  return apiClient.patch<UpdatePqrStatusResponse>(`/api/pqr/${id}/estado`, payload);
}

export function createSeguimiento(id: string, payload: CreateSeguimientoPayload) {
  return apiClient.post(`/api/pqr/${id}/seguimiento`, payload);
}

const emptyStats: PqrStats = {
  total: 0,
  byEstado: {
    recibida: 0,
    en_gestion: 0,
    resuelta: 0,
    cerrada: 0,
  },
  byTipo: {
    peticion: 0,
    queja: 0,
    reclamo: 0,
  },
  byPrioridad: {
    baja: 0,
    media: 0,
    alta: 0,
    urgente: 0,
  },
};

export async function getPqrStats(): Promise<PqrStats> {
  const response = await apiClient.get<PqrListResponse>('/api/pqr?page=1&limit=50');

  return response.data.reduce<PqrStats>(
    (stats, item) => ({
      total: stats.total + 1,
      byEstado: {
        ...stats.byEstado,
        [item.estado]: stats.byEstado[item.estado as EstadoPqr] + 1,
      },
      byTipo: {
        ...stats.byTipo,
        [item.tipo]: stats.byTipo[item.tipo as TipoPqr] + 1,
      },
      byPrioridad: {
        ...stats.byPrioridad,
        [item.prioridad]:
          stats.byPrioridad[item.prioridad as PrioridadPqr] + 1,
      },
    }),
    structuredClone(emptyStats),
  );
}
