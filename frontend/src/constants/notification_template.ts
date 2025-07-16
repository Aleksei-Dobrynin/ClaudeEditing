import { Dayjs } from "dayjs";

export type notification_template = {
  
  id: number;
  contact_type_id: number;
  code: string;
  subject: string;
  body: string;
  placeholders: string;
};
