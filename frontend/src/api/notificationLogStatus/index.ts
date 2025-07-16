import http from "api/https";
import { notificationLogStatus } from "constants/notificationLogStatus";

export const createnotificationLogStatus = (data: notificationLogStatus): Promise<any> => {
  return http.post(`/notificationLogStatus`, data);
};

export const deletenotificationLogStatus = (id: number): Promise<any> => {
  return http.remove(`/notificationLogStatus/${id}`, {});
};

export const getnotificationLogStatus = (id: number): Promise<any> => {
  return http.get(`/notificationLogStatus/${id}`);
};

export const getnotificationLogStatuses = (): Promise<any> => {
  return http.get("/notificationLogStatus/GetAll");
};

export const updatenotificationLogStatus = (data: notificationLogStatus): Promise<any> => {
  return http.put(`/notificationLogStatus/${data.id}`, data);
};


