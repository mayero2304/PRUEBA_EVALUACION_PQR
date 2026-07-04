export type RolUsuario = 'agente' | 'supervisor' | 'admin';

export type AuthUser = {
  sub: string;
  email: string;
  nombre: string;
  rol: RolUsuario;
};

export type LoginPayload = {
  email: string;
  password: string;
};
