import http from "api/https";
import { legal_record_registry } from "constants/legal_record_registry";

export const createlegal_record_registry = (data: legal_record_registry): Promise<any> => {
  return http.post(`/legal_record_registry`, data);
};

export const deletelegal_record_registry = (id: number): Promise<any> => {
  return http.remove(`/legal_record_registry/${id}`, {});
};

export const getlegal_record_registry = (id: number): Promise<any> => {
  return http.get(`/legal_record_registry/${id}`);
};

export const getlegal_record_registries = (): Promise<any> => {
  return http.get("/legal_record_registry/GetAll");
};

export const getlegal_record_registriesByAddress = (address: string): Promise<any> => {
  return http.get(`/legal_record_registry/GetByAddress?address="${address}`);
};

export const getlegal_record_registriesByFilter = (filter: any): Promise<any> => {
  return http.post("/legal_record_registry/GetByFilter", filter);
};

export const updatelegal_record_registry = (data: legal_record_registry): Promise<any> => {
  return http.put(`/legal_record_registry/${data.id}`, data);
};


