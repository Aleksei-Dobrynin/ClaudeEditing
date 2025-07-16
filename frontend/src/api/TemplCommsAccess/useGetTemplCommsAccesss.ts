import http from "api/https";

export const getTemplCommsAccesss = (): Promise<any> => {
  return http.get("/templ_comms_access/GetAll");
};
