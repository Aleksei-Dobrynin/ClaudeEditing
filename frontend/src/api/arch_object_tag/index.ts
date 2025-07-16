import http from "api/https";
import { ObjectTag } from "constants/ObjectTag";

export const createObjectTag = (data: ObjectTag): Promise<any> => {
  return http.post(`/arch_object_tag`, data);
};

export const deleteObjectTag = (id: number): Promise<any> => {
  return http.remove(`/arch_object_tag/${id}`, {});
};

export const getObjectTag = (id: number): Promise<any> => {
  return http.get(`/arch_object_tag/${id}`);
};

export const getObjectTags = (): Promise<any> => {
  return http.get("/arch_object_tag/GetAll");
};

export const getObjectTagsByIdObject = (id: number): Promise<any> => {
  return http.get(`/arch_object_tag/GetByIDObject?idObject=${id}`);
};

export const updateObjectTag = (data: ObjectTag): Promise<any> => {
  return http.put(`/arch_object_tag/${data.id}`, data);
};

export const addOrUpdateObjectTags = (tags: number[], application_id: number): Promise<any> => {
  const data = {
    tags,
    application_id,
  };
  return http.post(`/arch_object_tag/AddOrUpdateObjectTags`, data);
};
