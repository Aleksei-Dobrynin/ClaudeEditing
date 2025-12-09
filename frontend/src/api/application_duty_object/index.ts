import http from "api/https";
import { application_duty_object } from "constants/application_duty_object";

export const createapplication_duty_object = (data: application_duty_object): Promise<any> => {
  return http.post(`/application_duty_object`, data);
};

export const deleteapplication_duty_object = (id: number): Promise<any> => {
  return http.remove(`/application_duty_object/${id}`, {});
};

export const getapplication_duty_object = (id: number): Promise<any> => {
  return http.get(`/application_duty_object/${id}`);
};

export const getapplication_duty_objects = (): Promise<any> => {
  return http.get("/application_duty_object/GetAll");
};

export const updateapplication_duty_object = (data: application_duty_object): Promise<any> => {
  return http.put(`/application_duty_object/${data.id}`, data);
};


