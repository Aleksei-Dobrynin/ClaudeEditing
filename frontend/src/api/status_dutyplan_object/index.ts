import http from "api/https";
import { status_dutyplan_object } from "constants/status_dutyplan_object";

export const createstatus_dutyplan_object = (data: status_dutyplan_object): Promise<any> => {
  return http.post(`/status_dutyplan_object`, data);
};

export const deletestatus_dutyplan_object = (id: number): Promise<any> => {
  return http.remove(`/status_dutyplan_object/${id}`, {});
};

export const getstatus_dutyplan_object = (id: number): Promise<any> => {
  return http.get(`/status_dutyplan_object/${id}`);
};

export const getstatus_dutyplan_objects = (): Promise<any> => {
  return http.get("/status_dutyplan_object/GetAll");
};

export const updatestatus_dutyplan_object = (data: status_dutyplan_object): Promise<any> => {
  return http.put(`/status_dutyplan_object/${data.id}`, data);
};


