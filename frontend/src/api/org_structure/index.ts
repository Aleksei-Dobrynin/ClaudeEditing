import http from "api/https";
import { org_structure } from "constants/org_structure";

export const createorg_structure = (data: org_structure): Promise<any> => {
  return http.post(`/OrgStructure`, data);
};

export const deleteorg_structure = (id: number): Promise<any> => {
  return http.remove(`/OrgStructure/${id}`, {});
};

export const getorg_structure = (id: number): Promise<any> => {
  return http.get(`/OrgStructure/${id}`);
};

export const getorg_structures = (): Promise<any> => {
  return http.get("/OrgStructure/GetAll");
};

export const getMyOrgStructures = (): Promise<any> => {
  return http.get("/OrgStructure/GetAllMy");
};

export const updateorg_structure = (data: org_structure): Promise<any> => {
  return http.put(`/OrgStructure/${data.id}`, data);
};

export const getFilledTemplate = (
  idTemplate: number,
  language: string,
  parameters: {}
): Promise<any> => {
  return http.post("/S_DocumentTemplate/GetFilledDocumentHtml", {
    idTemplate: idTemplate,
    language: language,
    parameters: parameters,
    template_code: ""
  });
};
export const getFilledTemplateByCode = (
  template_code: string,
  language: string,
  parameters: {},
): Promise<any> => {
  return http.post("/S_DocumentTemplate/GetFilledDocumentHtmlByCode", {
    idTemplate: 0,
    language: language,
    parameters: parameters,
    template_code: template_code
  });
};

export const getFilledReport = (
  template_id: number,
  language: string,
  year: number,
  filter_type: string,
  month: number,
  kvartal: number,
  polgoda: number
): Promise<any> => {
  return http.post("/S_DocumentTemplate/GetFilledReport", {
    template_id,
    language,
    year,
    filter_type,
    month,
    kvartal,
    polgoda,
  });
};
