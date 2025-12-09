import http from "api/https";
import { application_task } from "constants/application_task";
import { Dayjs } from "dayjs";

export const createapplication_task = (data: application_task, fileName?: string, file?: any): Promise<any> => {

  const formData = new FormData();
  for (var key in data) {
    if (data[key] == null) continue;
    // if (typeof data[key] == "number" || typeof (data[key] - 0) == "number"){
    //   formData.append(key, data[key].toString().replace(",","."));
    // } else{
    //   formData.append(key, data[key]);
    // }
    formData.append(key, data[key]);
  }
  formData.append("document.name", fileName);
  formData.append("document.file", file);

  return http.post(`/application_task`, formData);
};

export const deleteapplication_task = (id: number): Promise<any> => {
  return http.remove(`/application_task/${id}`, {});
};

export const getapplication_task = (id: number): Promise<any> => {
  return http.get(`/application_task/${id}`);
};

export const getapplication_tasks = (): Promise<any> => {
  return http.get("/application_task/GetAll");
};

export const getMyApplications = (): Promise<any> => {
  return http.get("/application/GetMyApplication");
};

export const getMyTasks = (
  search: string,
  date_start: string,
  date_end: string,
  isExpiredTasks: boolean,
  isResolwedTasks: boolean
): Promise<any> => {
  const post = {
    search: search,
    date_start: date_start,
    date_end: date_end,
    isExpiredTasks: isExpiredTasks,
    isResolwedTasks: isResolwedTasks
  };
  return http.post(
    `/application_task/GetMyTasks`, post
  );
};
export const getStructureTasks = (
  search: string,
  date_start: string,
  date_end: string,
  isExpiredTasks: boolean,
  isResolwedTasks: boolean
): Promise<any> => {
  const post = {
    search: search,
    date_start: date_start,
    date_end: date_end,
    isExpiredTasks: isExpiredTasks,
    isResolwedTasks: isResolwedTasks
  };
  return http.post(
    `/application_task/GetStructureTasks`, post
  );
};

export const getAllTasks = (
  search: string,
  date_start: string,
  date_end: string,
  page: number,
  pageSize: number
): Promise<any> => {
  const post = {
    search: search,
    date_start: date_start,
    date_end: date_end,
    page: page,
    pageSize: pageSize,
  };
  return http.post(
    `/application_task/GetAllTasks`, post
  );
};
export const updateapplication_task = (data: application_task, fileName?: string, file?: any): Promise<any> => {
  const formData = new FormData();
  for (var key in data) {
    if (data[key] == null) continue;
    if (typeof data[key] == "number" || typeof (data[key] - 0) == "number"){
      formData.append(key, data[key].toString().replace(",","."));
    } else{
      formData.append(key, data[key]);
    }
  }
  formData.append("document.name", fileName);
  formData.append("document.file", file);
  return http.put(`/application_task/${data.id}`, formData);
};

export const getapplication_tasksByapplication_id = (application_id: number): Promise<any> => {
  return http.get(`/application_task/GetByapplication_id?application_id=${application_id}`);
};

export const GetOtherTaskByTaskId = (task_id: number): Promise<any> => {
  return http.get(`/application_task/GetOtherTaskByTaskId?task_id=${task_id}`);
};

export const changeTaskStatus = (task_id: number, status_id: number): Promise<any> => {
  return http.post(`/application_task/ChangeStatus`, {
    task_id,
    status_id,
  });
};