import http from "api/https";

export const getTemplCommsFooters = (): Promise<any> => {
  return http.get("/templ_comms_footer/GetAll");
};
