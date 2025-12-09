import http from "api/https";
import { application_task_assignee } from "constants/application_task_assignee";

export const createapplication_task_assignee = (data: application_task_assignee): Promise<any> => {
  return http.post(`/application_task_assignee`, data);
};

export const deleteapplication_task_assignee = (id: number): Promise<any> => {
  return http.remove(`/application_task_assignee/${id}`, {});
};

export const getapplication_task_assignee = (id: number): Promise<any> => {
  return http.get(`/application_task_assignee/${id}`);
};

export const getapplication_task_assignees = (): Promise<any> => {
  return http.get("/application_task_assignee/GetAll");
};

export const updateapplication_task_assignee = (data: application_task_assignee): Promise<any> => {
  return http.put(`/application_task_assignee/${data.id}`, data);
};


export const getapplication_task_assigneesByapplication_task_id = (application_task_id: number): Promise<any> => {
  return http.get(`/application_task_assignee/GetByapplication_task_id?application_task_id=${application_task_id}`);
};
