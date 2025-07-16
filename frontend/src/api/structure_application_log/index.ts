import http from "api/https";
import { structure_application_log } from "constants/structure_application_log";

export const createstructure_application_log = (data: structure_application_log): Promise<any> => {
  return http.post(`/structure_application_log`, data);
};

export const deletestructure_application_log = (id: number): Promise<any> => {
  return http.remove(`/structure_application_log/${id}`, {});
};

export const getstructure_application_log = (id: number): Promise<any> => {
  return http.get(`/structure_application_log/${id}`);
};

export const getstructure_application_logs = (): Promise<any> => {
  return http.get("/structure_application_log/GetAll");
};

export const getmystructure_application_logs = (): Promise<any> => {
  return http.get("/structure_application_log/GetAllMyStructure");
};

export const updatestructure_application_log = (data: structure_application_log): Promise<any> => {
  return http.put(`/structure_application_log/${data.id}`, data);
};

export const structureApplciationChangeStatus = (status: string, id: number): Promise<any> => {
  return http.get(`/structure_application_log/ChangeStatus?status=${status}&id=${id}`);
};
