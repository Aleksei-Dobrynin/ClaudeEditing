import http from "api/https";

export const getTemplReminderRecipientsGroup = (id: number): Promise<any> => {
  return http.get(`/templ_reminder_recipientsgroup/${id}`);
};
