import http from "api/https";
import { task_type } from "constants/task_type";

export const createtask_type = (data: task_type): Promise<any> => {
  return http.post(`/task_type`, data);
};

export const deletetask_type = (id: number): Promise<any> => {
  return http.remove(`/task_type/${id}`, {});
};

export const gettask_type = (id: number): Promise<any> => {
  return http.get(`/task_type/${id}`);
};

export const gettask_types = (): Promise<any> => {
  return http.get("/task_type/GetAll");
};

export const updatetask_type = (data: task_type): Promise<any> => {
  return http.put(`/task_type/${data.id}`, data);
};


