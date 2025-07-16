import http from "api/https";
import { org_structure } from "../../constants/org_structure";

export const createStructure = (data: org_structure): Promise<any> => {
  return http.post(`/OrgStructure/Create`, data);
};
