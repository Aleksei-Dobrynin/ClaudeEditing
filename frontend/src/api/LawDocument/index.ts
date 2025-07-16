import http from "api/https";
import { LawDocument } from "../../constants/LawDocument";

export const createLawDocument = (data: LawDocument): Promise<any> => {
  return http.post(`/LawDocument/Create`, data);
};

export const getLawDocuments = (): Promise<any> => {
  return http.get("/LawDocument/GetAll");
};

export const getLawDocument = (id: number): Promise<any> => {
  return http.get(`/LawDocument/GetOneById?id=${id}`);
};

export const updateLawDocument = (data: LawDocument): Promise<any> => {
  return http.put(`/LawDocument/Update`, data);
};

export const deleteLawDocument = (id: number): Promise<any> => {
  return http.remove(`/LawDocument/Delete?id=${id}`, {});
};



