import http from "api/https";
import { application_subtask } from "constants/application_subtask";

export const createapplication_subtask = (data: application_subtask): Promise<any> => {
  return http.post(`/application_subtask`, data);
};

export const deleteapplication_subtask = (id: number): Promise<any> => {
  return http.remove(`/application_subtask/${id}`, {});
};

export const getapplication_subtask = (id: number): Promise<any> => {
  return http.get(`/application_subtask/${id}`);
};

export const getapplication_subtasks = (): Promise<any> => {
  return http.get("/application_subtask/GetAll");
};

export const updateapplication_subtask = (data: application_subtask): Promise<any> => {
  return http.put(`/application_subtask/${data.id}`, data);
};


export const getapplication_subtasksByapplication_task_id = (application_task_id: number): Promise<any> => {
  return http.get(`/application_subtask/GetByapplication_task_id?application_task_id=${application_task_id}`);
};

export const changeSubTaskStatus = (subtask_id: number, status_id: number): Promise<any> => {
  return http.post(`/application_subtask/ChangeStatus`, {
    subtask_id,
    status_id,
  });
};