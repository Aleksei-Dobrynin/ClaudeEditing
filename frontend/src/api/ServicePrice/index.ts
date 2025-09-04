import http from "api/https";
import { ServicePrice } from "../../constants/ServicePrice";
import { number } from "yup";

export const getServicePrices = (): Promise<any> => {
  return http.get("/ServicePrice/GetAll");
};

export const getServicePricesByStructure = (structure_id: number): Promise<any> => {
  return http.get(`/ServicePrice/GetByStructure?structure_id=${structure_id}`);
};

export const getServicePricesByStructureAndService = (structure_id: number, service_id: number): Promise<any> => {
  return http.get(`/ServicePrice/GetByStructureAndService?structure_id=${structure_id}&service_id=${service_id}`);
};

export const getGetServiceAll = (): Promise<any> => {
  return http.get("/ServicePrice/GetServiceAll");
};

export const getGetServiceAllByService = (service_id: number): Promise<any> => {
  return http.get(`/ServicePrice/GetServiceAll?service_id=${service_id}`);
};

export const getGetServiceByStructureByService = (structure_id: number, service_id?: number): Promise<any> => {
  if (service_id !== undefined) {
    return http.get(`/ServicePrice/GetServiceByStructure?structure_id=${structure_id}&service_id=${service_id}`);
  } else {
    return http.get(`/ServicePrice/GetServiceByStructure?structure_id=${structure_id}`);
  }
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