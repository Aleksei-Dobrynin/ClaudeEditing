import http from "api/https";
import { structure_report_field } from "constants/structure_report_field";

export const createstructure_report_field = (data: structure_report_field): Promise<any> => {
  return http.post(`/StructureReportField/Create`, data);
};

export const deletestructure_report_field = (id: number): Promise<any> => {
  return http.remove(`/StructureReportField/${id}`, {});
};

export const getstructure_report_field = (id: number): Promise<any> => {
  return http.get(`/StructureReportField/${id}`);
};

export const getstructure_report_fields = (): Promise<any> => {
  return http.get("/StructureReportField/GetAll");
};

export const getstructure_report_fieldsByIdReport = (idReport: number): Promise<any> => {
  return http.get(`/StructureReportField/GetByidReport?idReport=${idReport}`);
};

export const updatestructure_report_field = (data: structure_report_field): Promise<any> => {
  return http.put(`/StructureReportField/${data.id}`, data);
};


