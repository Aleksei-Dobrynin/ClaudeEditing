// Создайте новый файл api/stepStatusLogApi.ts или добавьте в существующий API файл:

import http from "api/https";

export interface CreateStepStatusLogRequest {
  app_step_id: number;
  old_status: string;
  new_status: string;
  change_date: string;
  comments: string;
}

export interface UpdateStepStatusLogRequest extends CreateStepStatusLogRequest {
  id: number;
}

export interface StepStatusLogResponse {
  id: number;
  app_step_id: number;
  old_status: string;
  new_status: string;
  change_date: string;
  comments: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
}

export const createStepStatusLog = (data: CreateStepStatusLogRequest): Promise<any> => {
  return http.post(`/StepStatusLog/Create`, data);
};

export const deleteStepStatusLog = (id: number): Promise<any> => {
  return http.remove(`/StepStatusLog/Delete?id=${id}`, {});
};

export const getStepStatusLog = (id: number): Promise<any> => {
  return http.get(`/StepStatusLog/GetOneById?id=${id}`);
};

export const getStepStatusLogs = (): Promise<any> => {
  return http.get("/StepStatusLog/GetAll");
};

export const updateStepStatusLog = (data: UpdateStepStatusLogRequest): Promise<any> => {
  return http.put(`/StepStatusLog/Update`, data);
};

export const getStepStatusLogsByApplicationStep = (id: number): Promise<any> => {
  return http.get(`/StepStatusLog/GetByAplicationStep?id=${id}`);
};

export const getStepStatusLogsPaginated = (pageSize: number, pageNumber: number): Promise<any> => {
  return http.get(`/StepStatusLog/GetPaginated?pageSize=${pageSize}&pageNumber=${pageNumber}`);
};