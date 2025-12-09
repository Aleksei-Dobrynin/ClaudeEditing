import http from "api/https";
import { Entity } from "constants/Entity";

export const createEntity = (data: Entity): Promise<any> => {
  return http.post(`/entity`, data);
};

export const deleteEntity = (id: number): Promise<any> => {
  return http.remove(`/entity/${id}`, {});
};

export const getEntities = (): Promise<any> => {
  return http.get("/entity/GetAll");
};

export const getEntity = (id: number): Promise<any> => {
  return http.get(`/entity/${id}`);
};

export const updateEntity = (data: Entity): Promise<any> => {
  return http.put(`/entity/${data.id}`, data);
};
