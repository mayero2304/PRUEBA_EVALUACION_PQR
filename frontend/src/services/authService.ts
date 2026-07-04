import { apiClient } from '../lib/api';
import type { AuthUser, LoginPayload } from '../types/auth';

export function login(payload: LoginPayload) {
  return apiClient.post<AuthUser>('/api/auth/login', payload);
}

export function getCurrentUser() {
  return apiClient.get<AuthUser>('/api/auth/me');
}

export function logout() {
  return apiClient.post<void>('/api/auth/logout', {});
}
