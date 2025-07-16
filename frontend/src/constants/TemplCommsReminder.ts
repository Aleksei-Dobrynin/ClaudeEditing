import { Dayjs } from "dayjs";

export type TemplCommsReminder = {
  id: number;
  template_id: number;
  reminder_recipientsgroup_id: number;
  reminder_days_id: number;
  time_send_reminder: Dayjs;
};
