import http from "api/https";
import { archirecture_road } from "constants/archirecture_road";

export const createarchirecture_road = (data: archirecture_road): Promise<any> => {
  return http.post(`/archirecture_road`, data);
};

export const deletearchirecture_road = (id: number): Promise<any> => {
  return http.remove(`/archirecture_road/${id}`, {});
};

export const getarchirecture_road = (id: number): Promise<any> => {
  return http.get(`/archirecture_road/${id}`);
};

export const getarchirecture_roads = (): Promise<any> => {
  return http.get("/archirecture_road/GetAll");
};

export const updatearchirecture_road = (data: archirecture_road): Promise<any> => {
  return http.put(`/archirecture_road/${data.id}`, data);
};


