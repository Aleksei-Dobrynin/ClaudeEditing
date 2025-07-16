import http from "api/https";
import { LawDocumentType } from "../../constants/LawDocumentType";

export const createLawDocumentType = (data: LawDocumentType): Promise<any> => {
  return http.post(`/LawDocumentType/Create`, data);
};

export const getLawDocumentTypes = (): Promise<any> => {
  return http.get("/LawDocumentType/GetAll");
};

export const getLawDocumentType = (id: number): Promise<any> => {
  return http.get(`/LawDocumentType/GetOneById?id=${id}`);
};

export const updateLawDocumentType = (data: LawDocumentType): Promise<any> => {
  return http.put(`/LawDocumentType/Update`, data);
};

export const deleteLawDocumentType = (id: number): Promise<any> => {
  return http.remove(`/LawDocumentType/Delete?id=${id}`, {});
};



