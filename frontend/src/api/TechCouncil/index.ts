import http from "api/https";
import { TechCouncil } from "../../constants/TechCouncil";
import { ArchiveObjectFile } from "../../constants/ArchiveObjectFile";

export const createTechCouncil = (data: TechCouncil): Promise<any> => {
  return http.post(`/TechCouncil/Create`, data);
};

export const sendToTechCouncil = (data: any): Promise<any> => {
  return http.post(`/TechCouncil/SendTo`, data);
};

export const getTechCouncils = (): Promise<any> => {
  return http.get("/TechCouncil/GetAll");
};

export const uploadTechCouncilsFile = (data: any, file: any, fileName: string): Promise<any> => {
  const formData = new FormData();

  for (var key in data) {
    if (data[key] == null) continue;
    formData.append(key, data[key]);
  }
  formData.append("document.name", fileName);
  formData.append("document.file", file);

  return http.post("/TechCouncil/UploadFile", formData);
};

export const getGetTable = (): Promise<any> => {
  return http.get("/TechCouncil/GetTable");
};

export const getGetTableByStructure = (structure_id: number): Promise<any> => {
  return http.get(`/TechCouncil/GetTableByStructure?structure_id=${structure_id}`);
};

export const getGetTableBySession = (session_id: number): Promise<any> => {
  return http.get(`/TechCouncil/GetTableBySession?session_id=${session_id}`);
};

export const getGetTableWithOutSession = (): Promise<any> => {
  return http.get(`/TechCouncil/GetTableWithOutSession`);
};

export const getTechCouncilsByApplicationId = (application_id: number): Promise<any> => {
  return http.get(`/TechCouncil/GetByApplicationId?application_id=${application_id}`);
};

export const getTechCouncil = (id: number): Promise<any> => {
  return http.get(`/TechCouncil/GetOneById?id=${id}`);
};

export const updateTechCouncil = (data: TechCouncil): Promise<any> => {
  return http.put(`/TechCouncil/Update`, data);
};

export const updateTechCouncilLegalRecords = (data: any): Promise<any> => {
  return http.post(`/TechCouncil/UpdateLegalRecords`, data);
};

export const updateSessionTechCouncil = (data: any): Promise<any> => {
  return http.post(`/TechCouncil/UpdateSession`, data);
};

export const updateSessionTechCouncilOneCase = (data: any): Promise<any> => {
  return http.post(`/TechCouncil/UpdateSessionOneCase`, data);
};

export const deleteTechCouncil = (id: number): Promise<any> => {
  return http.remove(`/TechCouncil/Delete?id=${id}`, {});
};

export const getCountMyStructure = (): Promise<any> => {
  return http.get(`/TechCouncil/GetCountMyStructure`);
};

