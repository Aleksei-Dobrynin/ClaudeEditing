import http from "api/https";

export const getArchiveObject = (id: number): Promise<any> => {
  return http.get(`/ArchiveObject/GetOneById?id=${id}`);
};

export const getArchiveObjectByAppId = (process_id: number): Promise<any> => {
  return http.get(`/ArchiveObject/GetOneByProcessId?process_id=${process_id}`);
};
