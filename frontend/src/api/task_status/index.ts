import http from "api/https";
import { task_status } from "constants/task_status";

export const createtask_status = (data: task_status): Promise<any> => {
  return http.post(`/task_status`, data);
};

export const deletetask_status = (id: number): Promise<any> => {
  return http.remove(`/task_status/${id}`, {});
};

export const gettask_status = (id: number): Promise<any> => {
  return http.get(`/task_status/${id}`);
};

export const gettask_statuses = (): Promise<any> => {
  return http.get("/task_status/GetAll");
};

export const updatetask_status = (data: task_status): Promise<any> => {
  return http.put(`/task_status/${data.id}`, data);
};


