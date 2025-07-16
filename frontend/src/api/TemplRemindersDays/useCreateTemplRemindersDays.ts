import http from "api/https";
import { TemplRemindersDays } from "constants/TemplRemindersDays";

export const createTemplRemindersDays = (data: TemplRemindersDays): Promise<any> => {
  return http.post(`/templ_reminders_days`, data);
};
