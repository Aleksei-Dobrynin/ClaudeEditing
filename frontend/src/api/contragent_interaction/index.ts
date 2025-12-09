import http from "api/https";
import { contragent_interaction } from "constants/contragent_interaction";
import { Dayjs } from "dayjs";

export const createcontragent_interaction = (data: contragent_interaction): Promise<any> => {
  return http.post(`/contragent_interaction`, data);
};

export const deletecontragent_interaction = (id: number): Promise<any> => {
  return http.remove(`/contragent_interaction/${id}`, {});
};

export const getcontragent_interaction = (id: number): Promise<any> => {
  return http.get(`/contragent_interaction/${id}`);
};

export const getcontragent_interactions = (): Promise<any> => {
  return http.get("/contragent_interaction/GetAll");
};

export const getcontragent_interactions_filter = (pin: string, number: string, address: string, date_start: Dayjs, date_end: Dayjs): Promise<any> => {
  return http.get(`/contragent_interaction/GetFilter?pin=${pin}&number=${number}&address=${address}&date_start=${date_start ?? ""}&date_end=${date_end ?? ""}`);
};

export const updatecontragent_interaction = (data: contragent_interaction): Promise<any> => {
  return http.put(`/contragent_interaction/${data.id}`, data);
};


export const getcontragent_interactionsByapplication_id = (application_id: number): Promise<any> => {
  return http.get(`/contragent_interaction/GetByapplication_id?application_id=${application_id}`);
};


export const getcontragent_interactionsBytask_id= (task_id: number): Promise<any> => {
  return http.get(`/contragent_interaction/GetBytask_id?task_id=${task_id}`);
};
