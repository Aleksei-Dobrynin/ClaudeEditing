import http from "api/https";

export const getTemplReminderRecipientsGroups = (): Promise<any> => {
  return http.get("/templ_reminder_recipientsgroup/GetAll");
};
