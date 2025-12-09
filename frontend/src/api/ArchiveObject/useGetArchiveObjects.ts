import http from "api/https";
import { FilterApplication } from "../../constants/Application";

export const getArchiveObjects = (): Promise<any> => {
  return http.get("/ArchiveObject/GetAll");
};

export const getArchitectureProcess = (): Promise<any> => {
  return http.get("/ArchiveObject/GetArchitectureProcess");
};

export const getSearchDutyPlanObject = (number?: string, latitude?: number, longitude?: number, radius?: number): Promise<any> => {
  return http.get(`/ArchiveObject/Search?number=${number}&latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
};

export const getSearchDutyPlanObjectsByNumber = (number?: string): Promise<any> => {
  return http.get(`/ArchiveObject/SearchByNumber?number=${number}`);
};

export const getArchiveObjectPagination = (filter: any): Promise<any> => {
  return http.post(`/ArchiveObject/GetPaginated`, filter);
};