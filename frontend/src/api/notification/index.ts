import http from "api/https";
import { notification } from "constants/notification";

export const createnotification = (data: notification): Promise<any> => {
  return http.post(`/notification`, data);
};

export const deletenotification = (id: number): Promise<any> => {
  return http.remove(`/notification/${id}`, {});
};

export const getnotification = (id: number): Promise<any> => {
  return http.get(`/notification/${id}`);
};

export const getnotifications = (): Promise<any> => {
  return http.get("/notification/GetAll");
};

export const getmynotifications = (): Promise<any> => {
  return http.get(`/notification/GetMyNotifications`);
};

export const clearNotifications = (email: string): Promise<any> => {
  return http.post(`/notification/ClearNotifications`, { email: email });
};
export const clearNotification = (id: number): Promise<any> => {
  return http.post(`/notification/ClearNotification`, { id: id });
};

export const updatenotification = (data: notification): Promise<any> => {
  return http.put(`/notification/${data.id}`, data);
};
