import http from "api/https";
import { SmProjectFrequency } from "constants/SmProjectFrequency";

export const createSmProjectFrequency = (data: SmProjectFrequency): Promise<any> => {
  return http.post(`/sm_project_frequency`, data);
};

export const deleteSmProjectFrequency = (id: number): Promise<any> => {
  return http.remove(`/sm_project_frequency/${id}`, {});
};

export const getSmProjectFrequencies = (): Promise<any> => {
  return http.get("/sm_project_frequency/GetAll");
};

export const getSmProjectFrequency = (id: number): Promise<any> => {
  return http.get(`/sm_project_frequency/${id}`);
};


export const updateSmProjectFrequency = (data: SmProjectFrequency): Promise<any> => {
  return http.put(`/sm_project_frequency/${data.id}`, data);
};
