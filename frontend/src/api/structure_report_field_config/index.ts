import http from "api/https";
import { structure_report_field_config } from "constants/structure_report_field_config";

export const createstructure_report_field_config = (data: structure_report_field_config): Promise<any> => {
  return http.post(`/StructureReportFieldConfig/Create`, data);
};

export const deletestructure_report_field_config = (id: number): Promise<any> => {
  return http.remove(`/StructureReportFieldConfig/${id}`, {});
};

export const getstructure_report_field_config = (id: number): Promise<any> => {
  return http.get(`/StructureReportFieldConfig/${id}`);
};

export const getstructure_report_field_configs = (): Promise<any> => {
  return http.get("/StructureReportFieldConfig/GetAll");
};

export const getstructure_report_field_configByIdReportConfig = (idReportConfig: number): Promise<any> => {
  return http.get(`/StructureReportFieldConfig/GetByidReportConfig?idReportConfig=${idReportConfig}`);
};

export const updatestructure_report_field_config = (data: structure_report_field_config): Promise<any> => {
  return http.put(`/StructureReportFieldConfig/${data.id}`, data);
};


