import http from "api/https";
import { JournalPlaceholder } from "../../constants/JournalPlaceholder";

export const createJournalPlaceholder = (data: JournalPlaceholder): Promise<any> => {
  return http.post(`/JournalPlaceholder/Create`, data);
};

export const getJournalPlaceholders = (): Promise<any> => {
  return http.get("/JournalPlaceholder/GetAll");
};

export const getJournalPlaceholder = (id: number): Promise<any> => {
  return http.get(`/JournalPlaceholder/GetOneById?id=${id}`);
};

export const updateJournalPlaceholder = (data: JournalPlaceholder): Promise<any> => {
  return http.put(`/JournalPlaceholder/Update`, data);
};

export const deleteJournalPlaceholder = (id: number): Promise<any> => {
  return http.remove(`/JournalPlaceholder/Delete?id=${id}`, {});
};



