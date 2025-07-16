import http from "api/https";
import { organization_type } from "constants/organization_type";

export const createorganization_type = (data: organization_type): Promise<any> => {
  return http.post(`/organization_type`, data);
};

export const deleteorganization_type = (id: number): Promise<any> => {
  return http.remove(`/organization_type/${id}`, {});
};

export const getorganization_type = (id: number): Promise<any> => {
  return http.get(`/organization_type/${id}`);
};

export const getorganization_types = (): Promise<any> => {
  return http.get("/organization_type/GetAll");
};

export const updateorganization_type = (data: organization_type): Promise<any> => {
  return http.put(`/organization_type/${data.id}`, data);
};


