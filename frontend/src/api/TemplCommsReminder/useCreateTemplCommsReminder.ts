import http from "api/https";
import { TemplCommsReminder } from "constants/TemplCommsReminder";

export const createTemplCommsReminder = (data: TemplCommsReminder): Promise<any> => {
  return http.post(`/templ_comms_reminder`, data);
};
