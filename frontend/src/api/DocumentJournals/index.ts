import http from "api/https";
import { DocumentJournals } from "../../constants/DocumentJournals";
import { getSmProjectsPagination } from "../SmProject";

export const createDocumentJournals = (data: DocumentJournals): Promise<any> => {
  return http.post(`/DocumentJournals/Create`, data);
};

export const getDocumentJournalss = (): Promise<any> => {
  return http.get("/DocumentJournals/GetAll");
};

export const getDocumentJournals = (id: number): Promise<any> => {
  return http.get(`/DocumentJournals/GetOneById?id=${id}`);
};

export const updateDocumentJournals = (data: DocumentJournals): Promise<any> => {
  return http.put(`/DocumentJournals/Update`, data);
};

export const deleteDocumentJournals = (id: number): Promise<any> => {
  return http.remove(`/DocumentJournals/Delete?id=${id}`, {});
};

export const getPeriodTypes = (): Promise<any> => {
  return http.get("/DocumentJournals/GetPeriodTypes");
};


