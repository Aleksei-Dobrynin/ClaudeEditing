import http from "api/https";
import { EntityAttribute } from "constants/EntityAttributes";

export const createEntityAttribute = (data: EntityAttribute): Promise<any> => {
  return http.post(`/arch_object_tags`, data);
};

export const deleteEntityAttribute = (id: number): Promise<any> => {
  return http.remove(`/arch_object_tags/${id}`, {});
};

export const getEntityAttribute = (id: number): Promise<any> => {
  return http.get(`/arch_object_tags/${id}`);
};

export const getEntityAttributes = (): Promise<any> => {
  return http.get("/arch_object_tags/GetAll");
};

export const updateEntityAttribute = (data: EntityAttribute): Promise<any> => {
  return http.put(`/arch_object_tags/${data.id}`, data);
};
