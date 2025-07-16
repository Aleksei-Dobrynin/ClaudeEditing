import { Dayjs } from "dayjs";

export type TemplCommsEmail = {
  id: number;
  template_comms_id: number;
  language_id: number;
  body_email: string;
  subject_email: string;
  comms_reminder_id: number;
  is_for_report: boolean;
};
