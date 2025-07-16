import http from "api/https";

export const getTemplRemindersDayss = (): Promise<any> => {
  return http.get("/templ_reminders_days/GetAll");
};
