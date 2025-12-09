import http from "api/https";
import { org_structure_templates } from "constants/org_structure_templates";

export const createorg_structure_templates = (data: org_structure_templates): Promise<any> => {
  return http.post(`/org_structure_templates`, data);
};

export const deleteorg_structure_templates = (id: number): Promise<any> => {
  return http.remove(`/org_structure_templates/${id}`, {});
};

export const getorg_structure_templates = (id: number): Promise<any> => {
  return http.get(`/org_structure_templates/${id}`);
};

export const getorg_structure_template = (): Promise<any> => {
  return http.get("/org_structure_templates/GetAll");
};

export const updateorg_structure_templates = (data: org_structure_templates): Promise<any> => {
  return http.put(`/org_structure_templates/${data.id}`, data);
};


export const getmyorg_structure_templates = (): Promise<any> => {
  return http.get(`/org_structure_templates/GetMyTemplates`);
};

export const getorg_structure_templateBystructure_id = (structure_id: number): Promise<any> => {
  return http.get(`/org_structure_templates/GetBystructure_id?structure_id=${structure_id}`);
};
