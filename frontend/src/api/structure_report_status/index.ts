import http from "api/https";
import { structure_report_status } from "constants/structure_report_status";

export const createstructure_report_status = (data: structure_report_status): Promise<any> => {
  return http.post(`/StructureReportStatus/Create`, data);
};

export const deletestructure_report_status = (id: number): Promise<any> => {
  return http.remove(`/StructureReportStatus/${id}`, {});
};

export const getstructure_report_status = (id: number): Promise<any> => {
  return http.get(`/StructureReportStatus/${id}`);
};

export const getstructure_report_statuses = (): Promise<any> => {
  return http.get("/StructureReportStatus/GetAll");
};

export const updatestructure_report_status = (data: structure_report_status): Promise<any> => {
  return http.put(`/StructureReportStatus/${data.id}`, data);
};


