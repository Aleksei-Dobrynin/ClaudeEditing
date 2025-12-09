import http from "api/https";
import { release_seen } from "constants/release_seen";

export const createrelease_seen = (data: release_seen): Promise<any> => {
  return http.post(`/release_seen`, data);
};

export const deleterelease_seen = (id: number): Promise<any> => {
  return http.remove(`/release_seen/${id}`, {});
};

export const getrelease_seen = (id: number): Promise<any> => {
  return http.get(`/release_seen/${id}`);
};

export const getrelease_seens = (): Promise<any> => {
  return http.get("/release_seen/GetAll");
};

export const updaterelease_seen = (data: release_seen): Promise<any> => {
  return http.put(`/release_seen/${data.id}`, data);
};


export const getrelease_seensByrelease_id = (release_id: number): Promise<any> => {
  return http.get(`/release_seen/GetByrelease_id?release_id=${release_id}`);
};
