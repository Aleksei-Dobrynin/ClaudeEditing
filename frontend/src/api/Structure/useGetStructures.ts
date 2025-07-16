import http from "api/https";

export const getStructures = (): Promise<any> => {
  return http.get("/OrgStructure/GetAll");
};