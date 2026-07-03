import { apiClient } from '../lib/api';
import type {
  CreatePqrPayload,
  CreatePqrResponse,
  CreateSeguimientoPayload,
  PqrDetail,
  PqrFilters,
  PqrListItem,
  PqrListResponse,
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
