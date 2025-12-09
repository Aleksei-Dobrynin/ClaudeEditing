import http from "api/https";
import { TemplReminderRecipientsGroup } from "constants/TemplReminderRecipientsGroup";

export const createTemplReminderRecipientsGroup = (data: TemplReminderRecipientsGroup): Promise<any> => {
  return http.post(`/templ_reminder_recipientsgroup`, data);
};
