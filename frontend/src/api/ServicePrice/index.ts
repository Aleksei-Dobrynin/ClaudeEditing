import http from "api/https";
import { ServicePrice } from "../../constants/ServicePrice";
import { number } from "yup";

export const getServicePrices = (): Promise<any> => {
  return http.get("/ServicePrice/GetAll");
};

export const getGetServiceAll = (): Promise<any> => {
  return http.get("/ServicePrice/GetServiceAll");
};

export const deleteServicePrice = (id: number): Promise<any> => {
  return http.remove(`/ServicePrice/Delete?id=${id}`, {});
};

export const getServicePrice = (id: number): Promise<any> => {
  return http.get(`/ServicePrice/GetOneById?id=${id}`);
};

export const createServicePrice = (data: ServicePrice): Promise<any> => {
  return http.post(`/ServicePrice/Create`, data);
};

export const updateServicePrice = (data: ServicePrice): Promise<any> => {
  return http.put(`/ServicePrice/Update`, data);
};

export const getByApplicationAndStructure = (application_id: number, structure_id: number): Promise<any> => {
  return http.get(`/ServicePrice/GetByApplicationAndStructure?application_id=${application_id}&structure_id=${structure_id}`);
};