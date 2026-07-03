export type TipoPqr = 'peticion' | 'queja' | 'reclamo';
export type EstadoPqr = 'recibida' | 'en_gestion' | 'resuelta' | 'cerrada';
export type PrioridadPqr = 'baja' | 'media' | 'alta' | 'urgente';
export type CanalPqr = 'web' | 'telefono' | 'presencial' | 'email';

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
