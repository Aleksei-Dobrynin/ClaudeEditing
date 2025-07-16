import http from "api/https";
import { WorkDocumentType } from "../../constants/WorkDocumentType";

export const createWorkDocumentType = (data: WorkDocumentType): Promise<any> => {
  return http.post(`/WorkDocumentType/Create`, data);
};

export const updateWorkDocumentType = (data: WorkDocumentType): Promise<any> => {
  return http.put(`/WorkDocumentType/Update`, data);
};

export const deleteWorkDocumentType = (id: number): Promise<any> => {
  return http.remove(`/WorkDocumentType/Delete?id=${id}`, {});
};



