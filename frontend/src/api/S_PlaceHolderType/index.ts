import http from "api/https";
import { S_PlaceHolderType } from "constants/S_PlaceHolderType";

export const createS_PlaceHolderType = (data: S_PlaceHolderType): Promise<any> => {
  return http.post(`/S_PlaceHolderType`, data);
};

export const deleteS_PlaceHolderType = (id: number): Promise<any> => {
  return http.remove(`/S_PlaceHolderType/${id}`, {});
};

export const getS_PlaceHolderType = (id: number): Promise<any> => {
  return http.get(`/S_PlaceHolderType/${id}`);
};

export const getS_PlaceHolderTypes = (): Promise<any> => {
  return http.get("/S_PlaceHolderType/GetAll");
};

export const updateS_PlaceHolderType = (data: S_PlaceHolderType): Promise<any> => {
  return http.put(`/S_PlaceHolderType/${data.id}`, data);
};


