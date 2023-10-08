import { instance } from "./http";

export const loginGoogle = () => {
  return instance.get('auth/google');
}

export const loginFacebook = () => {
  return instance.get('auth/facebook');
}

export const login = (data: { username: string; password: string} ) => {
  return instance.post('auth/login', data);
}

export const register = (data: { username: string; password: string} ) => {
  return instance.post('auth/register', data);
}

export const logout = (data: { refreshToken: string } ) => {
  return instance.post('auth/logout', data);
}

export const refreshToken = (data: { refreshToken: string } ) => {
  return instance.post('auth/refresh-tokens', data);
}

export const forgotPassword = (data: { email: string } ) => {
  return instance.post('auth/forgot-password', data);
}

export const resetPassword = (data: { password: string }, token: string ) => {
  return instance.post(`auth/forgot-password?token=${token}`, data);
}

export const verifyEmail = (token: string ) => {
  return instance.post(`auth/verify-email?token=${token}`);
}