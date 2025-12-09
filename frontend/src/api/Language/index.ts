import http from "api/https";
import { Language } from "constants/Language";

export const createLanguage = (data: Language): Promise<any> => {
  return http.post(`/Language`, data);
};

export const deleteLanguage = (id: number): Promise<any> => {
  return http.remove(`/Language/${id}`, {});
};

export const getLanguage = (id: number): Promise<any> => {
  return http.get(`/Language/${id}`);
};

export const getLanguages = (): Promise<any> => {
  return http.get("/Language/GetAll");
};

export const updateLanguage = (data: Language): Promise<any> => {
  return http.put(`/Language/${data.id}`, data);
};


