import http from "api/https";

export const getTemplCommsReminders = (): Promise<any> => {
  return http.get("/templ_comms_reminder/GetAll");
};
