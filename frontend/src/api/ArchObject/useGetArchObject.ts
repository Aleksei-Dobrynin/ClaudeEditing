import http from "api/https";

export const getArchObject = (id: number): Promise<any> => {
  return http.get(`/ArchObject/GetOneById?id=${id}`);
};
