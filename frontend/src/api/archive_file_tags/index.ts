import http from "api/https";
import { archive_file_tags } from "constants/archive_file_tags";

export const createarchive_file_tags = (data: archive_file_tags): Promise<any> => {
  return http.post(`/archive_file_tags`, data);
};

export const deletearchive_file_tags = (id: number): Promise<any> => {
  return http.remove(`/archive_file_tags/${id}`, {});
};

export const getarchive_file_tags = (id: number): Promise<any> => {
  return http.get(`/archive_file_tags/${id}`);
};

export const getarchive_file_tag = (): Promise<any> => {
  return http.get("/archive_file_tags/GetAll");
};

export const updatearchive_file_tags = (data: archive_file_tags): Promise<any> => {
  return http.put(`/archive_file_tags/${data.id}`, data);
};

export const getarchive_file_tagByfile_id = (file_id: number): Promise<any> => {
  return http.get(`/archive_file_tags/GetByfile_id?file_id=${file_id}`);
};
