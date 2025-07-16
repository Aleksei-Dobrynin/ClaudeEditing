import http from "api/https";
import { legal_act_registry_status } from "constants/legal_act_registry_status";

export const createlegal_act_registry_status = (data: legal_act_registry_status): Promise<any> => {
  return http.post(`/legal_act_registry_status`, data);
};

export const deletelegal_act_registry_status = (id: number): Promise<any> => {
  return http.remove(`/legal_act_registry_status/${id}`, {});
};

export const getlegal_act_registry_status = (id: number): Promise<any> => {
  return http.get(`/legal_act_registry_status/${id}`);
};

export const getlegal_act_registry_statuses = (): Promise<any> => {
  return http.get("/legal_act_registry_status/GetAll");
};

export const updatelegal_act_registry_status = (data: legal_act_registry_status): Promise<any> => {
  return http.put(`/legal_act_registry_status/${data.id}`, data);
};


