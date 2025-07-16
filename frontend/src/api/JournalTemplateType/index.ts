import http from "api/https";
import { JournalTemplateType } from "../../constants/JournalTemplateType";

export const createJournalTemplateType = (data: JournalTemplateType): Promise<any> => {
  return http.post(`/JournalTemplateType/Create`, data);
};

export const getJournalTemplateTypes = (): Promise<any> => {
  return http.get("/JournalTemplateType/GetAll");
};

export const getJournalTemplateType = (id: number): Promise<any> => {
  return http.get(`/JournalTemplateType/GetOneById?id=${id}`);
};

export const updateJournalTemplateType = (data: JournalTemplateType): Promise<any> => {
  return http.put(`/JournalTemplateType/Update`, data);
};

export const deleteJournalTemplateType = (id: number): Promise<any> => {
  return http.remove(`/JournalTemplateType/Delete?id=${id}`, {});
};



