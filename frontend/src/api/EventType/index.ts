import http from "api/https";
import { event_type } from "constants/event_type";

export const createevent_type = (data: event_type): Promise<any> => {
  return http.post(`/EventType`, data);
};

export const deleteevent_type = (id: number): Promise<any> => {
  return http.remove(`/EventType/${id}`, {});
};

export const getevent_type = (id: number): Promise<any> => {
  return http.get(`/EventType/${id}`);
};

export const getevent_types = (): Promise<any> => {
  return http.get("/EventType/GetAll");
};

export const updateevent_type = (data: event_type): Promise<any> => {
  return http.put(`/EventType/${data.id}`, data);
};