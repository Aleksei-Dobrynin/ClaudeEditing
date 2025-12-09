import http from "api/https";
import { TechCouncilSession } from "../../constants/TechCouncilSession";

export const createTechCouncilSession = (data: any): Promise<any> => {
  return http.post(`/TechCouncilSession/Create`, data);
};

export const getTechCouncilSessions = (): Promise<any> => {
  return http.get("/TechCouncilSession/GetAll");
};

export const getTechCouncilArchiveSessions = (): Promise<any> => {
  return http.get("/TechCouncilSession/GetArchiveAll");
};

export const getTechCouncilSession = (id: number): Promise<any> => {
  return http.get(`/TechCouncilSession/GetOneById?id=${id}`);
};

export const updateTechCouncilSession = (data: any): Promise<any> => {
  return http.put(`/TechCouncilSession/Update`, data);
};

export const deleteTechCouncilSession = (id: number): Promise<any> => {
  return http.remove(`/TechCouncilSession/Delete?id=${id}`, {});
};

export const toArchiveTechCouncilSession = (id: number): Promise<any> => {
  let data = {
    id: id
  };
  return http.put(`/TechCouncilSession/toArchive`, data);
};


