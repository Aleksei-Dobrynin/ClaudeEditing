import http from "api/https";
import { legal_object } from "constants/legal_object";

export const createlegal_object = (data: legal_object): Promise<any> => {
  return http.post(`/legal_object`, data);
};

export const deletelegal_object = (id: number): Promise<any> => {
  return http.remove(`/legal_object/${id}`, {});
};

export const getlegal_object = (id: number): Promise<any> => {
  return http.get(`/legal_object/${id}`);
};

export const getlegal_objects = (): Promise<any> => {
  return http.get("/legal_object/GetAll");
};

export const updatelegal_object = (data: legal_object): Promise<any> => {
  return http.put(`/legal_object/${data.id}`, data);
};


