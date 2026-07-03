export type TipoPqr = 'peticion' | 'queja' | 'reclamo';
export type EstadoPqr = 'recibida' | 'en_gestion' | 'resuelta' | 'cerrada';
export type PrioridadPqr = 'baja' | 'media' | 'alta' | 'urgente';
export type CanalPqr = 'web' | 'presencial' | 'email';

export type PqrSolicitante = {
  id: string;
  nombre: string;
  apellido: string | null;
  identificacion: string;
  email: string;
};

export type PqrListItem = {
  id: string;
  radicado: string;
  tipo: TipoPqr;
  titulo: string;
  categoria: string;
  prioridad: PrioridadPqr;
  estado: EstadoPqr;
  canal: CanalPqr;
  createdAt: string;
  updatedAt: string;
  solicitante: PqrSolicitante;
};

export type SeguimientoPqr = {
  id: string;
  descripcion: string;
  tipoAccion: string;
  fechaRegistro: string;
  pqrId: string;
  usuarioId: string | null;
  usuario?: {
    id: string;
    nombre: string;
    email: string;
    rol: string;
  } | null;
};

export type PqrDetail = PqrListItem & {
  descripcion: string;
  seguimientos: SeguimientoPqr[];
};

export type PqrListResponse = {
  data: PqrListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type PqrFilters = {
  page: number;
  limit: number;
  radicado: string;
  tipo: string;
  estado: string;
  prioridad: string;
  categoria: string;
};

export type CreatePqrPayload = {
  solicitante: {
    nombre: string;
    apellido: string;
    identificacion: string;
    email: string;
    telefono?: string;
  };
  tipo: TipoPqr;
  titulo: string;
  descripcion: string;
  categoria: string;
  prioridad: PrioridadPqr;
  canal?: CanalPqr;
};

export type CreatePqrResponse = {
  id: string;
  radicado: string;
  estado: EstadoPqr;
};
