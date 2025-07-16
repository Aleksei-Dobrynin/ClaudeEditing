import http from "api/https";
import { archive_doc_tag } from "constants/archive_doc_tag";

export const createarchive_doc_tag = (data: archive_doc_tag): Promise<any> => {
  return http.post(`/archive_doc_tag`, data);
};

export const deletearchive_doc_tag = (id: number): Promise<any> => {
  return http.remove(`/archive_doc_tag/${id}`, {});
};

export const getarchive_doc_tag = (id: number): Promise<any> => {
  return http.get(`/archive_doc_tag/${id}`);
};

export const getarchive_doc_tags = (): Promise<any> => {
  return http.get("/archive_doc_tag/GetAll");
};

export const updatearchive_doc_tag = (data: archive_doc_tag): Promise<any> => {
  return http.put(`/archive_doc_tag/${data.id}`, data);
};


