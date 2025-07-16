import http from "api/https";
import { archive_folder } from "constants/archive_folder";

export const createarchive_folder = (data: archive_folder): Promise<any> => {
  return http.post(`/archive_folder`, data);
};

export const deletearchive_folder = (id: number): Promise<any> => {
  return http.remove(`/archive_folder/${id}`, {});
};

export const getarchive_folder = (id: number): Promise<any> => {
  return http.get(`/archive_folder/${id}`);
};

export const getarchive_folders = (): Promise<any> => {
  return http.get("/archive_folder/GetAll");
};
export const getarchive_foldersByObjId = (dutyplan_object_id: number): Promise<any> => {
  return http.get(`/archive_folder/GetBydutyplan_object_id?dutyplan_object_id=${dutyplan_object_id}`);
};

export const updatearchive_folder = (data: archive_folder): Promise<any> => {
  return http.put(`/archive_folder/${data.id}`, data);
};


