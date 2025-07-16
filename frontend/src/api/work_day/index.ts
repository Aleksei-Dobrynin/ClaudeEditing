import http from "api/https";
import { work_day } from "constants/work_day";

export const creatework_day = (data: work_day): Promise<any> => {
  return http.post(`/WorkDay`, data);
};

export const deletework_day = (id: number): Promise<any> => {
  return http.remove(`/WorkDay/${id}`, {});
};

export const getwork_day = (id: number): Promise<any> => {
  return http.get(`/WorkDay/${id}`);
};

export const getwork_days = (): Promise<any> => {
  return http.get("/WorkDay/GetAll");
};

export const updatework_day = (data: work_day): Promise<any> => {
  return http.put(`/WorkDay/${data.id}`, data);
};


export const getwork_daysByschedule_id = (schedule_id: number): Promise<any> => {
  return http.get(`/WorkDay/GetByschedule_id?schedule_id=${schedule_id}`);
};
