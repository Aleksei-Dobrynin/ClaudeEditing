import http from "api/https";
import { SmProjectType } from "constants/SmProjectType";

export const createSmProjectType = (data: SmProjectType): Promise<any> => {
  return http.post(`/sm_project_type`, data);
};
export const deleteSmProjectType = (id: number): Promise<any> => {
  return http.remove(`/sm_project_type/${id}`, {});
};

export const getSmProjectType = (id: number): Promise<any> => {
  return http.get(`/sm_project_type/${id}`);
};

export const getSmProjectTypes = (): Promise<any> => {
  return http.get("/sm_project_type/GetAll");
};

export const updateSmProjectType = (data: SmProjectType): Promise<any> => {
  return http.put(`/sm_project_type/${data.id}`, data);
};
