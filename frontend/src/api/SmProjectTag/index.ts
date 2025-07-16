import http from "api/https";
import { SmProjectTag } from "constants/SmProjectTag";

export const createSmProjectTag = (data: SmProjectTag): Promise<any> => {
  return http.post(`/sm_project_tags`, data);
};

export const deleteSmProjectTag = (id: number): Promise<any> => {
  return http.remove(`/sm_project_tags/${id}`, {});
};

export const getSmProjectTag = (id: number): Promise<any> => {
  return http.get(`/sm_project_tags/${id}`);
};

export const getSmProjectTags = (): Promise<any> => {
  return http.get("/sm_project_tags/GetAll");
};

export const getSmProjectTagsByProjectId = (project_id: number): Promise<any> => {
  return http.get(`/sm_project_tags/GetByproject_id?project_id=${project_id}`);
};

export const updateSmProjectTag = (data: SmProjectTag): Promise<any> => {
  return http.put(`/sm_project_tags/${data.id}`, data);
};
