import http from "api/https";
import { S_DocumentTemplateType } from "constants/S_DocumentTemplateType";

export const createS_DocumentTemplateType = (data: S_DocumentTemplateType): Promise<any> => {
  return http.post(`/S_DocumentTemplateType`, data);
};

export const deleteS_DocumentTemplateType = (id: number): Promise<any> => {
  return http.remove(`/S_DocumentTemplateType/${id}`, {});
};

export const getS_DocumentTemplateType = (id: number): Promise<any> => {
  return http.get(`/S_DocumentTemplateType/${id}`);
};

export const getS_DocumentTemplateTypes = (): Promise<any> => {
  return http.get("/S_DocumentTemplateType/GetAll");
};

export const updateS_DocumentTemplateType = (data: S_DocumentTemplateType): Promise<any> => {
  return http.put(`/S_DocumentTemplateType/${data.id}`, data);
};


