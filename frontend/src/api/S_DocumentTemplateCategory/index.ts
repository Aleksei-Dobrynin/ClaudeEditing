import http from "api/https";
import { S_DocumentTemplateCategory } from "constants/S_DocumentTemplateCategory";

export const createS_DocumentTemplateCategory = (data: S_DocumentTemplateCategory): Promise<any> => {
  return http.post(`/S_DocumentTemplateCategory`, data);
};

export const deleteS_DocumentTemplateCategory = (id: number): Promise<any> => {
  return http.remove(`/S_DocumentTemplateCategory/${id}`, {});
};

export const getS_DocumentTemplateCategory = (id: number): Promise<any> => {
  return http.get(`/S_DocumentTemplateCategory/${id}`);
};

export const getS_DocumentTemplateCategorys = (): Promise<any> => {
  return http.get("/S_DocumentTemplateCategory/GetAll");
};

export const updateS_DocumentTemplateCategory = (data: S_DocumentTemplateCategory): Promise<any> => {
  return http.put(`/S_DocumentTemplateCategory/${data.id}`, data);
};


