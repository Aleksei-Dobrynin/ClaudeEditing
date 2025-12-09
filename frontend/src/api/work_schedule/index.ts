import http from "api/https";
import { work_schedule } from "constants/work_schedule";

export const creatework_schedule = (data: work_schedule): Promise<any> => {
  return http.post(`/WorkSchedule`, data);
};

export const deletework_schedule = (id: number): Promise<any> => {
  return http.remove(`/WorkSchedule/${id}`, {});
};

export const getwork_schedule = (id: number): Promise<any> => {
  return http.get(`/WorkSchedule/${id}`);
};

export const getwork_schedules = (): Promise<any> => {
  return http.get("/WorkSchedule/GetAll");
};

export const updatework_schedule = (data: work_schedule): Promise<any> => {
  return http.put(`/WorkSchedule/${data.id}`, data);
};


