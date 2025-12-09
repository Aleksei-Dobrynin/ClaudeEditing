import http from "api/https";
import { legal_act_registry } from "constants/legal_act_registry";

export const createlegal_act_registry = (data: legal_act_registry): Promise<any> => {
  return http.post(`/legal_act_registry`, data);
};

export const deletelegal_act_registry = (id: number): Promise<any> => {
  return http.remove(`/legal_act_registry/${id}`, {});
};

export const getlegal_act_registry = (id: number): Promise<any> => {
  return http.get(`/legal_act_registry/${id}`);
};

export const getlegal_act_registries = (): Promise<any> => {
  return http.get("/legal_act_registry/GetAll");
};

export const getlegal_act_registriesByAddress = (address: string): Promise<any> => {
  return http.get(`/legal_act_registry/GetByAddress?address="${address}`);
};

export const getlegal_act_registriesByFilter = (filter: any): Promise<any> => {
  return http.post("/legal_act_registry/GetByFilter", filter);
};

export const updatelegal_act_registry = (data: legal_act_registry): Promise<any> => {
  return http.put(`/legal_act_registry/${data.id}`, data);
};


