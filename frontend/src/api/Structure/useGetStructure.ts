import http from "api/https";

export const getStructure = (id: number): Promise<any> => {
  return http.get(`/OrgStructure/GetOneById?id=${id}`);
};
