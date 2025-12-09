import http from "api/https";

export const getArchiveLogStatus = (id: number): Promise<any> => {
  return http.get(`/ArchiveLogStatus/GetOneById?id=${id}`);
};
