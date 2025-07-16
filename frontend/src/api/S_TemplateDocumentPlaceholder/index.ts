import http from "api/https";
import { S_TemplateDocumentPlaceholder } from "constants/S_TemplateDocumentPlaceholder";

export const createS_TemplateDocumentPlaceholder = (data: S_TemplateDocumentPlaceholder): Promise<any> => {
  return http.post(`/S_TemplateDocumentPlaceholder`, data);
};

export const deleteS_TemplateDocumentPlaceholder = (id: number): Promise<any> => {
  return http.remove(`/S_TemplateDocumentPlaceholder/${id}`, {});
};

export const getS_TemplateDocumentPlaceholder = (id: number): Promise<any> => {
  return http.get(`/S_TemplateDocumentPlaceholder/${id}`);
};

export const getS_TemplateDocumentPlaceholders = (): Promise<any> => {
  return http.get("/S_TemplateDocumentPlaceholder/GetAll");
};

export const updateS_TemplateDocumentPlaceholder = (data: S_TemplateDocumentPlaceholder): Promise<any> => {
  return http.put(`/S_TemplateDocumentPlaceholder/${data.id}`, data);
};


