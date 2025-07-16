import http from "api/https";
import { SystemSetting } from "../../constants/SystemSetting";

export const createSystemSetting = (data: SystemSetting): Promise<any> => {
  return http.post(`/SystemSetting/Create`, data);
};

export const getSystemSettings = (): Promise<any> => {
  return http.get("/SystemSetting/GetAll");
};

export const getSystemSetting = (id: number): Promise<any> => {
  return http.get(`/SystemSetting/GetOneById?id=${id}`);
};

export const getSystemSettingByCodes = (codes: string[]): Promise<any> => {
  return http.get(`/SystemSetting/GetByCodes?codes=${codes.map(encodeURIComponent).join(',')}`);
};

export const updateSystemSetting = (data: SystemSetting): Promise<any> => {
  return http.put(`/SystemSetting/Update`, data);
};

export const deleteSystemSetting = (id: number): Promise<any> => {
  return http.remove(`/SystemSetting/Delete?id=${id}`, {});
};



