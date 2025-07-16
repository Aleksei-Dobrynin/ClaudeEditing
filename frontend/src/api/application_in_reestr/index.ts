import http from "api/https";
import { application_in_reestr } from "constants/application_in_reestr";

export const createapplication_in_reestr = (data: application_in_reestr): Promise<any> => {
  return http.post(`/application_in_reestr`, data);
};

export const deleteapplication_in_reestr = (id: number): Promise<any> => {
  return http.remove(`/application_in_reestr/${id}`, {});
};

export const deleteapplication_in_reestrsByAppId = (application_id: number): Promise<any> => {
  return http.remove(`/application_in_reestr/DeleteByAppId/${application_id}`, {});
};

export const getapplication_in_reestr = (id: number): Promise<any> => {
  return http.get(`/application_in_reestr/${id}`);
};

export const getapplication_in_reestrs = (): Promise<any> => {
  return http.get("/application_in_reestr/GetAll");
};

export const updateapplication_in_reestr = (data: application_in_reestr): Promise<any> => {
  return http.put(`/application_in_reestr/${data.id}`, data);
};

export const getapplication_in_reestrsByreestr_id = (reestr_id: number): Promise<any> => {
  return http.get(`/application_in_reestr/GetByreestr_id?reestr_id=${reestr_id}`);
};

export const getOtchetData = (reestr_id: number): Promise<any> => {
  return http.get(`/application_in_reestr/GetOtchetData?reestr_id=${reestr_id}`);
};

export const getSvodnaya = (year: number, month: number, status: string): Promise<any> => {
  return http.get(`/application_in_reestr/GetSvodnaya?year=${year}&month=${month}&status=${status}`);
};
