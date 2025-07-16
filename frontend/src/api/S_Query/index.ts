import http from "api/https";
import { S_Query } from "constants/S_Query";

export const createS_Query = (data: S_Query): Promise<any> => {
  return http.post(`/S_Query`, data);
};

export const deleteS_Query = (id: number): Promise<any> => {
  return http.remove(`/S_Query/${id}`, {});
};

export const getS_Query = (id: number): Promise<any> => {
  return http.get(`/S_Query/${id}`);
};

export const getS_Querys = (): Promise<any> => {
  return http.get("/S_Query/GetAll");
};

export const updateS_Query = (data: S_Query): Promise<any> => {
  return http.put(`/S_Query/${data.id}`, data);
};


