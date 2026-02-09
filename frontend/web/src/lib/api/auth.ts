import api from '../axios';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface AuthError {
  statusCode: number;
  error: string;
  message: string;
}

export async function registerUser(
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/auth/register', {
    email,
    password,
    name,
  });
  return response.data;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/auth/login', {
    email,
    password,
  });
  return response.data;
}

export async function refreshToken(token: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/auth/refresh', {
    refreshToken: token,
  });
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>('/api/auth/me');
  return response.data;
}
