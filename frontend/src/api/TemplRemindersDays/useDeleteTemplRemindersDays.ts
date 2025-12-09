import http from "api/https";

export const deleteTemplRemindersDays = (id: number): Promise<any> => {
  return http.remove(`/templ_reminders_days/${id}`, {});
};
