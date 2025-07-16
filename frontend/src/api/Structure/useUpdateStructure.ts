import http from "api/https";
import { org_structure } from "../../constants/org_structure";

export const updateStructure = (data: org_structure): Promise<any> => {
  return http.put(`/OrgStructure/Update`, data);
};
