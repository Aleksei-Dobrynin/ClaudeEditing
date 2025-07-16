import http from "api/https";
import { service_path } from "constants/service_path";

export const createservice_path = (data: service_path): Promise<any> => {
  return http.post(`/service_path`, data);
};

export const deleteservice_path = (id: number): Promise<any> => {
  return http.remove(`/service_path/${id}`, {});
};

export const getservice_path = (id: number): Promise<any> => {
  return http.get(`/service_path/${id}`);
};

export const getservice_paths = (): Promise<any> => {
  return http.get("/service_path/GetAll");
};

export const updateservice_path = (data: service_path): Promise<any> => {
  return http.put(`/service_path/${data.id}`, data);
};


