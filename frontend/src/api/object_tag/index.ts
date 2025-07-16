import http from "api/https";
import { object_tag } from "constants/object_tag";

export const createobject_tag = (data: object_tag): Promise<any> => {
  return http.post(`/object_tag`, data);
};

export const deleteobject_tag = (id: number): Promise<any> => {
  return http.remove(`/object_tag/${id}`, {});
};

export const getobject_tag = (id: number): Promise<any> => {
  return http.get(`/object_tag/${id}`);
};

export const getobject_tags = (): Promise<any> => {
  return http.get("/object_tag/GetAll");
};

export const updateobject_tag = (data: object_tag): Promise<any> => {
  return http.put(`/object_tag/${data.id}`, data);
};


