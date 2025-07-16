import http from "api/https";
import { JournalApplication } from "../../constants/JournalApplication";

export const createJournalApplication = (data: JournalApplication): Promise<any> => {
  return http.post(`/JournalApplication/Create`, data);
};

export const getJournalApplications = (): Promise<any> => {
  return http.get("/JournalApplication/GetAll");
};

export const getJournalApplication = (id: number): Promise<any> => {
  return http.get(`/JournalApplication/GetOneById?id=${id}`);
};

export const updateJournalApplication = (data: JournalApplication): Promise<any> => {
  return http.put(`/JournalApplication/Update`, data);
};

export const deleteJournalApplication = (id: number): Promise<any> => {
  return http.remove(`/JournalApplication/Delete?id=${id}`, {});
};

export const getJournalApplicationsPagination = (page: number,
                                               pageSize: number,
                                               sortBy: string,
                                               sortType: string,
                                               journalsId: number): Promise<any> => {
  return http.get(`/JournalApplication/GetPaginated?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortType=${sortType}&journalsId=${journalsId}`);
};



