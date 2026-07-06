import { apiClient } from '../lib/api';
import type {
  Notificacion,
  NotificacionesResponse,
} from '../types/notificacion';

export function getNotificaciones() {
  return apiClient.get<NotificacionesResponse>('/api/notificaciones');
}

export function markNotificacionAsRead(id: string) {
  return apiClient.patch<Notificacion>(`/api/notificaciones/${id}/leida`, {});
}
