import http from "api/https";
import { structure_report } from "constants/structure_report";

export const createstructure_report = (data: structure_report): Promise<any> => {
  return http.post(`/StructureReport/Create`, data);
};

export const createstructure_report_fromConfig = (data: structure_report): Promise<any> => {
  return http.post(`/StructureReport/CreateFromConfig`, data);
};

export const deletestructure_report = (id: number): Promise<any> => {
  return http.remove(`/StructureReport/${id}`, {});
};

export const getstructure_report = (id: number): Promise<any> => {
  return http.get(`/StructureReport/${id}`);
};

export const getstructure_reports = (): Promise<any> => {
  return http.get("/StructureReport/GetAll");
};

export const updatestructure_report = (data: structure_report): Promise<any> => {
  return http.put(`/StructureReport/${data.id}`, data);
};


