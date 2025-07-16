import http from "api/https";
import { ApplicationOutgoingDocument } from "../../constants/ApplicationOutgoingDocument";

export const createApplicationOutgoingDocument = (data: ApplicationOutgoingDocument): Promise<any> => {
  return http.post(`/ApplicationOutgoingDocument/Create`, data);
};

export const getApplicationOutgoingDocuments = (): Promise<any> => {
  return http.get("/ApplicationOutgoingDocument/GetAll");
};

export const getApplicationOutgoingDocument = (id: number): Promise<any> => {
  return http.get(`/ApplicationOutgoingDocument/GetOneById?id=${id}`);
};

export const updateApplicationOutgoingDocument = (data: ApplicationOutgoingDocument): Promise<any> => {
  return http.put(`/ApplicationOutgoingDocument/Update`, data);
};

export const deleteApplicationOutgoingDocument = (id: number): Promise<any> => {
  return http.remove(`/ApplicationOutgoingDocument/Delete?id=${id}`, {});
};



