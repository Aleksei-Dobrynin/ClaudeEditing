import http from "api/https";
import { Y_Employee110 } from "constants/Y_Employee110";

export const createY_Employee110 = (data: Y_Employee110): Promise<any> => {
  return http.post(`/Y_Employee110`, data);
};

export const deleteY_Employee110 = (id: number): Promise<any> => {
  return http.remove(`/Y_Employee110/${id}`, {});
};

export const getY_Employee110 = (id: number): Promise<any> => {
  return http.get(`/Y_Employee110/${id}`);
};

export const getY_Employee110s = (): Promise<any> => {
  return http.get("/Y_Employee110/GetAll");
};

export const updateY_Employee110 = (data: Y_Employee110): Promise<any> => {
  return http.put(`/Y_Employee110/${data.id}`, data);
};


