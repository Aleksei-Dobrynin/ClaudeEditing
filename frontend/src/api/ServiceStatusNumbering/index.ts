import http from "api/https";
import { ServiceStatusNumbering } from "../../constants/ServiceStatusNumbering";

export const createServiceStatusNumbering = (data: ServiceStatusNumbering): Promise<any> => {
  return http.post(`/ServiceStatusNumbering/Create`, data);
};

export const getServiceStatusNumberings = (): Promise<any> => {
  return http.get("/ServiceStatusNumbering/GetAll");
};

export const getServiceStatusNumberingsByServiceId = (id: number): Promise<any> => {
  return http.get(`/ServiceStatusNumbering/GetByServiceId?service_id=${id}`);
};

export const getServiceStatusNumberingsByJournalId = (id: number): Promise<any> => {
  return http.get(`/ServiceStatusNumbering/GetByJournalId?journal_id=${id}`);
};

export const getServiceStatusNumbering = (id: number): Promise<any> => {
  return http.get(`/ServiceStatusNumbering/GetOneById?id=${id}`);
};

export const updateServiceStatusNumbering = (data: ServiceStatusNumbering): Promise<any> => {
  return http.put(`/ServiceStatusNumbering/Update`, data);
};

export const deleteServiceStatusNumbering = (id: number): Promise<any> => {
  return http.remove(`/ServiceStatusNumbering/Delete?id=${id}`, {});
};



