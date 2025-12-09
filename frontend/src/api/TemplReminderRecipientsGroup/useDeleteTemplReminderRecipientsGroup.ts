import http from "api/https";

export const deleteTemplReminderRecipientsGroup = (id: number): Promise<any> => {
  return http.remove(`/templ_reminder_recipientsgroup/${id}`, {});
};
