import http from "api/https";
import { Y_Card110 } from "constants/Y_Card110";

export const createY_Card110 = (data: Y_Card110): Promise<any> => {
  return http.post(`/Y_Card110`, data);
};

export const deleteY_Card110 = (id: number): Promise<any> => {
  return http.remove(`/Y_Card110/${id}`, {});
};

export const getY_Card110 = (id: number): Promise<any> => {
  return http.get(`/Y_Card110/${id}`);
};

export const getY_Card110s = (): Promise<any> => {
  return http.get("/Y_Card110/GetAll");
};

export const updateY_Card110 = (data: Y_Card110): Promise<any> => {
  return http.put(`/Y_Card110/${data.id}`, data);
};


