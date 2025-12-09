import http from "api/https";
import { TemplCommsReminder } from "constants/TemplCommsReminder";

export const updateTemplCommsReminder = (data: TemplCommsReminder): Promise<any> => {
  return http.put(`/templ_comms_reminder/${data.id}`, data);
};
