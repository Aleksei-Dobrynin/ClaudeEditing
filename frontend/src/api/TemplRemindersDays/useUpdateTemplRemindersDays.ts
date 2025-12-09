import http from "api/https";
import { TemplRemindersDays } from "constants/TemplRemindersDays";

export const updateTemplRemindersDays = (data: TemplRemindersDays): Promise<any> => {
  return http.put(`/templ_reminders_days/${data.id}`, data);
};
