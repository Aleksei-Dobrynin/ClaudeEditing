import http from "api/https";

export const getTemplRemindersDays = (id: number): Promise<any> => {
  return http.get(`/templ_reminders_days/${id}`);
};
