import http from "api/https";
import { legal_registry_status } from "constants/legal_registry_status";

export const createlegal_registry_status = (data: legal_registry_status): Promise<any> => {
  return http.post(`/legal_registry_status`, data);
};

export const deletelegal_registry_status = (id: number): Promise<any> => {
  return http.remove(`/legal_registry_status/${id}`, {});
};

export const getlegal_registry_status = (id: number): Promise<any> => {
  return http.get(`/legal_registry_status/${id}`);
};

export const getlegal_registry_statuses = (): Promise<any> => {
  return http.get("/legal_registry_status/GetAll");
};

export const updatelegal_registry_status = (data: legal_registry_status): Promise<any> => {
  return http.put(`/legal_registry_status/${data.id}`, data);
};


