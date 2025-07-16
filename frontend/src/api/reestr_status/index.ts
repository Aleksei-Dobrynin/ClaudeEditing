import http from "api/https";
import { reestr_status } from "constants/reestr_status";

export const createreestr_status = (data: reestr_status): Promise<any> => {
  return http.post(`/reestr_status`, data);
};

export const deletereestr_status = (id: number): Promise<any> => {
  return http.remove(`/reestr_status/${id}`, {});
};

export const getreestr_status = (id: number): Promise<any> => {
  return http.get(`/reestr_status/${id}`);
};

export const getreestr_statuses = (): Promise<any> => {
  return http.get("/reestr_status/GetAll");
};

export const updatereestr_status = (data: reestr_status): Promise<any> => {
  return http.put(`/reestr_status/${data.id}`, data);
};


