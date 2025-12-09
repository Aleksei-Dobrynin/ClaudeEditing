import http from "api/https";
import { notification_template } from "constants/notification_template";

export const createnotification_template = (data: notification_template): Promise<any> => {
  return http.post(`/notification_template`, data);
};

export const deletenotification_template = (id: number): Promise<any> => {
  return http.remove(`/notification_template/${id}`, {});
};

export const getnotification_template = (id: number): Promise<any> => {
  return http.get(`/notification_template/${id}`);
};

export const getnotification_templates = (): Promise<any> => {
  return http.get("/notification_template/GetAll");
};

export const updatenotification_template = (data: notification_template): Promise<any> => {
  return http.put(`/notification_template/${data.id}`, data);
};


