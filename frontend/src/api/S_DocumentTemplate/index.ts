import http from "api/https";
import { S_DocumentTemplate } from "constants/S_DocumentTemplate";

export const createS_DocumentTemplate = (data: S_DocumentTemplate): Promise<any> => {
  return http.post(`/S_DocumentTemplate`, data);
};

export const deleteS_DocumentTemplate = (id: number): Promise<any> => {
  return http.remove(`/S_DocumentTemplate/${id}`, {});
};

export const getS_DocumentTemplate = (id: number): Promise<any> => {
  return http.get(`/S_DocumentTemplate/${id}`);
};

export const getS_DocumentTemplates = (): Promise<any> => {
  return http.get("/S_DocumentTemplate/GetAll");
};

export const getS_DocumentTemplatesByType = (type: string): Promise<any> => {
  return http.get(`/S_DocumentTemplate/GetByType?type=${type}`);
};

export const getMyStructureReports = (): Promise<any> => {
  return http.get(`/S_DocumentTemplate/GetMyStructureReports`);
};

export const getS_DocumentTemplatesByApplicationType = (): Promise<any> => {
  return http.get("/S_DocumentTemplate/GetByApplicationType");
};

export const getS_DocumentTemplatesByApplicationTypeAndID = (idApplication: number): Promise<any> => {
  return http.get(`/S_DocumentTemplate/GetByApplicationTypeAndID?idApplication=${idApplication}`);
};

export const updateS_DocumentTemplate = (data: S_DocumentTemplate): Promise<any> => {
  return http.put(`/S_DocumentTemplate/${data.id}`, data);
};


