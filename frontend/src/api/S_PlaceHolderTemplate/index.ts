import http from "api/https";
import { S_PlaceHolderTemplate } from "constants/S_PlaceHolderTemplate";

export const createS_PlaceHolderTemplate = (data: S_PlaceHolderTemplate): Promise<any> => {
  return http.post(`/S_PlaceHolderTemplate`, data);
};

export const deleteS_PlaceHolderTemplate = (id: number): Promise<any> => {
  return http.remove(`/S_PlaceHolderTemplate/${id}`, {});
};

export const getS_PlaceHolderTemplate = (id: number): Promise<any> => {
  return http.get(`/S_PlaceHolderTemplate/${id}`);
};

export const getS_PlaceHolderTemplates = (): Promise<any> => {
  return http.get("/S_PlaceHolderTemplate/GetAll");
};

export const updateS_PlaceHolderTemplate = (data: S_PlaceHolderTemplate): Promise<any> => {
  return http.put(`/S_PlaceHolderTemplate/${data.id}`, data);
};


export const getS_PlaceHolderTemplatesByidQuery = (idQuery: number): Promise<any> => {
  return http.get(`/S_PlaceHolderTemplate/GetByidQuery?idQuery=${idQuery}`);
};
