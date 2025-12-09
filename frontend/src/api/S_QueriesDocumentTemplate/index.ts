import http from "api/https";
import { S_QueriesDocumentTemplate } from "constants/S_QueriesDocumentTemplate";

export const createS_QueriesDocumentTemplate = (data: S_QueriesDocumentTemplate): Promise<any> => {
  return http.post(`/S_QueriesDocumentTemplate`, data);
};

export const deleteS_QueriesDocumentTemplate = (id: number): Promise<any> => {
  return http.remove(`/S_QueriesDocumentTemplate/${id}`, {});
};

export const getS_QueriesDocumentTemplate = (id: number): Promise<any> => {
  return http.get(`/S_QueriesDocumentTemplate/${id}`);
};

export const getS_QueriesDocumentTemplates = (): Promise<any> => {
  return http.get("/S_QueriesDocumentTemplate/GetAll");
};

export const updateS_QueriesDocumentTemplate = (data: S_QueriesDocumentTemplate): Promise<any> => {
  return http.put(`/S_QueriesDocumentTemplate/${data.id}`, data);
};


