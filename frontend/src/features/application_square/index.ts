import http from "api/https";
import { application_square } from "constants/application_square";

export const createapplication_square = (data: application_square): Promise<any> => {
  return http.post(`/application_square`, data);
};

export const deleteapplication_square = (id: number): Promise<any> => {
  return http.remove(`/application_square/${id}`, {});
};

export const getapplication_square = (id: number): Promise<any> => {
  return http.get(`/application_square/${id}`);
};

export const getapplication_squares = (): Promise<any> => {
  return http.get("/application_square/GetAll");
};

export const updateapplication_square = (data: application_square): Promise<any> => {
  return http.put(`/application_square/${data.id}`, data);
};


