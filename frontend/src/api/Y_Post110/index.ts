import http from "api/https";
import { Y_Post110 } from "constants/Y_Post110";

export const createY_Post110 = (data: Y_Post110): Promise<any> => {
  return http.post(`/Y_Post110`, data);
};

export const deleteY_Post110 = (id: number): Promise<any> => {
  return http.remove(`/Y_Post110/${id}`, {});
};

export const getY_Post110 = (id: number): Promise<any> => {
  return http.get(`/Y_Post110/${id}`);
};

export const getY_Post110s = (): Promise<any> => {
  return http.get("/Y_Post110/GetAll");
};

export const updateY_Post110 = (data: Y_Post110): Promise<any> => {
  return http.put(`/Y_Post110/${data.id}`, data);
};


