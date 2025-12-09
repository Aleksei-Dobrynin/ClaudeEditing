import http from "api/https";
import { identity_document_type } from "constants/identity_document_type";

export const createidentity_document_type = (data: identity_document_type): Promise<any> => {
  return http.post(`/identity_document_type`, data);
};

export const deleteidentity_document_type = (id: number): Promise<any> => {
  return http.remove(`/identity_document_type/${id}`, {});
};

export const getidentity_document_type = (id: number): Promise<any> => {
  return http.get(`/identity_document_type/${id}`);
};

export const getidentity_document_types = (): Promise<any> => {
  return http.get("/identity_document_type/GetAll");
};

export const updateidentity_document_type = (data: identity_document_type): Promise<any> => {
  return http.put(`/identity_document_type/${data.id}`, data);
};


