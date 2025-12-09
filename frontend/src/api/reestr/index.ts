import http from "api/https";
import { reestr } from "constants/reestr";

export const createreestr = (data: reestr): Promise<any> => {
  return http.post(`/reestr`, data);
};

export const deletereestr = (id: number): Promise<any> => {
  return http.remove(`/reestr/${id}`, {});
};

export const getreestr = (id: number): Promise<any> => {
  return http.get(`/reestr/${id}`);
};

export const getreestrs = (): Promise<any> => {
  return http.get("/reestr/GetAll");
};
export const getMyreestrs = (): Promise<any> => {
  return http.get("/reestr/GetAllMy");
};

export const updatereestr = (data: reestr): Promise<any> => {
  return http.put(`/reestr/${data.id}`, data);
};

export const setApplicationToReestr = (application_id: number, reestr_id: number): Promise<any> => {
  return http.post("/reestr/SetApplicationToReestr", { application_id, reestr_id });
};

export const getCheckApplicationBeforeRegistering = (application_id: number, reestr_id: number): Promise<any> => {
  return http.get(`/reestr/CheckApplicationBeforeRegistering?application_id=${application_id}`);
};

export const changeReestrStatus = (status_code: string, reestr_id: number): Promise<any> => {
  return http.post("/reestr/ChangeReestrStatus", { status_code, reestr_id });
};

export const changeAllApplicationStatusInReestr = (reestr_id: number): Promise<any> => {
  return http.post("/reestr/ChangeAllApplicationStatusInReestr", { reestr_id });
};