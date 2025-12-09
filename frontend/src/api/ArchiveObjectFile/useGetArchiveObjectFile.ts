import http from "api/https";

export const getArchiveObjectFile = (id: number): Promise<any> => {
  return http.get(`/ArchiveObjectFile/GetOneById?id=${id}`);
};
