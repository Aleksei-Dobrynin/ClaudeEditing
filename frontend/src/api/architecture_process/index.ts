import http from "api/https";
import { architecture_process } from "constants/architecture_process";

export const createarchitecture_process = (data: architecture_process): Promise<any> => {
  return http.post(`/architecture_process`, data);
};


export const sendToDutyPlan = (app_id: number, dp_outgoing_number: string, workDocs: number[], uplDocs: number[]): Promise<any> => {
  return http.post(`/architecture_process/SendToDutyPlan`, {
    app_id,
    dp_outgoing_number,
    workDocs,
    uplDocs,
  });
};

export const changeApplicationProcessStatus = (
  application_id: number,
  status_id: number
): Promise<any> => {
  return http.post(`/architecture_process/ChangeStatus`, {
    application_id,
    status_id,
  });
};

export const deletearchitecture_process = (id: number): Promise<any> => {
  return http.remove(`/architecture_process/${id}`, {});
};

export const getarchitecture_process = (id: number): Promise<any> => {
  return http.get(`/architecture_process/${id}`);
};

export const getarchitecture_processes = (): Promise<any> => {
  return http.get("/architecture_process/GetAll");
};

export const getarchitecture_processesToArchive = (): Promise<any> => {
  return http.get("/architecture_process/GetAllToArchive");
};

export const updatearchitecture_process = (data: architecture_process): Promise<any> => {
  return http.put(`/architecture_process/${data.id}`, data);
};

export const getGenerateNumber = (app_id: number): Promise<any> => {
  return http.get(`/ArchObject/GenerateNumber?app_id=${app_id}`);
};


