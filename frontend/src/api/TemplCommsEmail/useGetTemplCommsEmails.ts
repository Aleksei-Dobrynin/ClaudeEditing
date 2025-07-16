import http from "api/https";

export const getTemplCommsEmails = (): Promise<any> => {
  return http.get("/templ_comms_email/GetAll");
};
