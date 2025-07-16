import http from "api/https";
import { TemplReminderRecipientsGroup } from "constants/TemplReminderRecipientsGroup";

export const updateTemplReminderRecipientsGroup = (data: TemplReminderRecipientsGroup): Promise<any> => {
  return http.put(`/templ_reminder_recipientsgroup/${data.id}`, data);
};
