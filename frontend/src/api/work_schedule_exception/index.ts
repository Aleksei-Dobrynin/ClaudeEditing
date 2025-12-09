import http from "api/https";
import { work_schedule_exception } from "constants/work_schedule_exception";

export const creatework_schedule_exception = (data: work_schedule_exception): Promise<any> => {
  return http.post(`/WorkScheduleException`, data);
};

export const deletework_schedule_exception = (id: number): Promise<any> => {
  return http.remove(`/WorkScheduleException/${id}`, {});
};

export const getwork_schedule_exception = (id: number): Promise<any> => {
  return http.get(`/WorkScheduleException/${id}`);
};

export const getwork_schedule_exceptions = (): Promise<any> => {
  return http.get("/WorkScheduleException/GetAll");
};

export const updatework_schedule_exception = (data: work_schedule_exception): Promise<any> => {
  return http.put(`/WorkScheduleException/${data.id}`, data);
};


export const getwork_schedule_exceptionsByschedule_id = (schedule_id: number): Promise<any> => {
  return http.get(`/WorkScheduleException/GetByschedule_id?schedule_id=${schedule_id}`);
};
