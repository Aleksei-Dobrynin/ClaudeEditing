import { Dayjs } from "dayjs";

export type TemplTemplateComms = {
  id: number;
  name: string;
  description: string;
  is_send_report: boolean;
  reminder_days_id: number;
  time_send_report: Dayjs;
  owner_entity_id: number;
};
