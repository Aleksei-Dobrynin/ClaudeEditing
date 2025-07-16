import http from "api/https";
import { application_subtask_assignee } from "constants/application_subtask_assignee";

export const createapplication_subtask_assignee = (data: application_subtask_assignee): Promise<any> => {
  return http.post(`/application_subtask_assignee`, data);
};

export const deleteapplication_subtask_assignee = (id: number): Promise<any> => {
  return http.remove(`/application_subtask_assignee/${id}`, {});
};

export const getapplication_subtask_assignee = (id: number): Promise<any> => {
  return http.get(`/application_subtask_assignee/${id}`);
};

export const getapplication_subtask_assignees = (): Promise<any> => {
  return http.get("/application_subtask_assignee/GetAll");
};

export const updateapplication_subtask_assignee = (data: application_subtask_assignee): Promise<any> => {
  return http.put(`/application_subtask_assignee/${data.id}`, data);
};


export const getapplication_subtask_assigneesByapplication_subtask_id = (application_subtask_id: number): Promise<any> => {
  return http.get(`/application_subtask_assignee/GetByapplication_subtask_id?application_subtask_id=${application_subtask_id}`);
};
