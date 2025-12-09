import http from "api/https";
import { structure_report_config } from "constants/structure_report_config";

export const createstructure_report_config = (data: structure_report_config): Promise<any> => {
  return http.post(`/StructureReportConfig/Create`, data);
};

export const deletestructure_report_config = (id: number): Promise<any> => {
  return http.remove(`/StructureReportConfig/${id}`, {});
};

export const getstructure_report_config = (id: number): Promise<any> => {
  return http.get(`/StructureReportConfig/${id}`);
};

export const getstructure_report_configs = (): Promise<any> => {
  return http.get("/StructureReportConfig/GetAll");
};

export const updatestructure_report_config = (data: structure_report_config): Promise<any> => {
  return http.put(`/StructureReportConfig/${data.id}`, data);
};


