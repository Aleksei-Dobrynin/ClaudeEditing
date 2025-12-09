import http from "api/https";

export const getArchiveLogStatuss = (): Promise<any> => {
  return http.get("/ArchiveLogStatus/GetAll");
};