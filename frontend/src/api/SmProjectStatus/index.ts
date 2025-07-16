import http from "api/https";
import { SmProjectStatus } from "constants/SmProjectStatus";

export const createSmProjectStatus = (data: SmProjectStatus): Promise<any> => {
  return http.post(`/sm_project_status`, data);
};

export const deleteSmProjectStatus = (id: number): Promise<any> => {
  return http.remove(`/sm_project_status/${id}`, {});
};

export const getSmProjectStatus = (id: number): Promise<any> => {
  return http.get(`/sm_project_status/${id}`);
};

export const getSmProjectStatuses = (): Promise<any> => {
  return http.get("/sm_project_status/GetAll");
};

export const updateSmProjectStatus = (data: SmProjectStatus): Promise<any> => {
  return http.put(`/sm_project_status/${data.id}`, data);
};
