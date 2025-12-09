import http from "api/https";
import { path_step } from "constants/path_step";

export const createpath_step = (data: path_step): Promise<any> => {
  return http.post(`/path_step`, data);
};

export const deletepath_step = (id: number): Promise<any> => {
  return http.remove(`/path_step/${id}`, {});
};

export const getpath_step = (id: number): Promise<any> => {
  return http.get(`/path_step/${id}`);
};

export const getpath_steps = (): Promise<any> => {
  return http.get("/path_step/GetAll");
};

export const updatepath_step = (data: path_step): Promise<any> => {
  return http.put(`/path_step/${data.id}`, data);
};


export const getpath_stepsBypath_id = (path_id: number): Promise<any> => {
  return http.get(`/path_step/GetBypath_id?path_id=${path_id}`);
};
