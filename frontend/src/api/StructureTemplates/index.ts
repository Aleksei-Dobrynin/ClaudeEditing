import http from "api/https";
// import { StructureTemplates } from "../../constants/StructureTemplates";

export const createStructureTemplates = (data: any): Promise<any> => {
  return http.post(`/StructureTemplates/Create`, data);
};

export const getTemplatesForStructure = (structure_id: number): Promise<any> => {
  return http.get(`/StructureTemplates/GetAllForStructure?structure_id=${structure_id}`);
};

export const getStructureTemplates = (id: number): Promise<any> => {
  return http.get(`/StructureTemplates/GetOneById?id=${id}`);
};

export const updateStructureTemplates = (data: any): Promise<any> => {
  return http.put(`/StructureTemplates/Update`, data);
};

export const deleteStructureTemplates = (id: number): Promise<any> => {
  return http.remove(`/StructureTemplates/Delete?id=${id}`, {});
};



