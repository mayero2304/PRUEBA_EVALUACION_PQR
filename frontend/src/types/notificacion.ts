export type TipoNotificacion = 'nueva_pqr';

export type Notificacion = {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: TipoNotificacion;
  leida: boolean;
  pqrId: string | null;
  createdAt: string;
  pqr?: {
    id: string;
    radicado: string;
    titulo: string;
  } | null;
};

export type NotificacionesResponse = {
  data: Notificacion[];
  unreadCount: number;
};
