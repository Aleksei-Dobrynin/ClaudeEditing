import http from "api/https";
import { architecture_status } from "constants/architecture_status";

export const createarchitecture_status = (data: architecture_status): Promise<any> => {
  return http.post(`/architecture_status`, data);
};

export const deletearchitecture_status = (id: number): Promise<any> => {
  return http.remove(`/architecture_status/${id}`, {});
};

export const getarchitecture_status = (id: number): Promise<any> => {
  return http.get(`/architecture_status/${id}`);
};

export const getarchitecture_statuses = (): Promise<any> => {
  return http.get("/architecture_status/GetAll");
};

export const updatearchitecture_status = (data: architecture_status): Promise<any> => {
  return http.put(`/architecture_status/${data.id}`, data);
};


