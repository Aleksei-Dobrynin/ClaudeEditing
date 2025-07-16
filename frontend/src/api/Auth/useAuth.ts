import http from "api/https";
import { Login, ChangePassword, ForgotPassword } from "../../constants/Login";

export const login = (data: Login): Promise<any> => {
  return http.post(`/Auth/Login`, data);
};

export const getUser = (data: Login): Promise<any> => {
  return http.post(`/Auth/GetCurrentUser`, data);
};

export const getUserInfo = (): Promise<any> => {
  return http.post(`/Auth/GetCurrentUser`, {});
};

export const changePassword = (data: ChangePassword): Promise<any> => {
  return http.post(`/Auth/ChangePassword`, data);
};

export const recoveryPassword = (data: ForgotPassword): Promise<any> => {
  return http.post(`/Auth/ForgotPassword`, data);
};

export const isSuperAdmin = (username: string): Promise<any> => {
  return http.get(`/Auth/IsSuperAdmin?username=${username}`);
};

export const getMyRoles = (): Promise<any> => {
  return http.get(`/Auth/GetMyRoles`);
};