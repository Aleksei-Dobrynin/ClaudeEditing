import http from "api/https";
import { S_DocumentTemplateTranslation } from "constants/S_DocumentTemplateTranslation";

export const createS_DocumentTemplateTranslation = (data: S_DocumentTemplateTranslation): Promise<any> => {
  return http.post(`/S_DocumentTemplateTranslation`, data);
};

export const deleteS_DocumentTemplateTranslation = (id: number): Promise<any> => {
  return http.remove(`/S_DocumentTemplateTranslation/${id}`, {});
};

export const getS_DocumentTemplateTranslation = (id: number): Promise<any> => {
  return http.get(`/S_DocumentTemplateTranslation/${id}`);
};

export const getS_DocumentTemplateTranslations = (): Promise<any> => {
  return http.get("/S_DocumentTemplateTranslation/GetAll");
};

export const updateS_DocumentTemplateTranslation = (data: S_DocumentTemplateTranslation): Promise<any> => {
  return http.put(`/S_DocumentTemplateTranslation/${data.id}`, data);
};


export const getS_DocumentTemplateTranslationsByidDocumentTemplate = (idDocumentTemplate: number): Promise<any> => {
  return http.get(`/S_DocumentTemplateTranslation/GetByidDocumentTemplate?idDocumentTemplate=${idDocumentTemplate}`);
};
