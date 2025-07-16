import http from "api/https";
import { release_video } from "constants/release_video";

export const createrelease_video = (data: release_video): Promise<any> => {
  return http.post(`/release_video`, data);
};

export const deleterelease_video = (id: number): Promise<any> => {
  return http.remove(`/release_video/${id}`, {});
};

export const getrelease_video = (id: number): Promise<any> => {
  return http.get(`/release_video/${id}`);
};

export const getrelease_videos = (): Promise<any> => {
  return http.get("/release_video/GetAll");
};

export const updaterelease_video = (data: release_video): Promise<any> => {
  return http.put(`/release_video/${data.id}`, data);
};


export const getrelease_videosByrelease_id = (release_id: number): Promise<any> => {
  return http.get(`/release_video/GetByrelease_id?release_id=${release_id}`);
};
