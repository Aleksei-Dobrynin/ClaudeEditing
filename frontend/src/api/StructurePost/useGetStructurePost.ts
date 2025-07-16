import http from "api/https";

export const getStructurePost = (id: number): Promise<any> => {
  return http.get(`/StructurePost/GetOneById?id=${id}`);
};
