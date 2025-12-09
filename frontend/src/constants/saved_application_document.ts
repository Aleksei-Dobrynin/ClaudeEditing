import { Dayjs } from "dayjs";

export type saved_application_document = {
  
  id: number;
  application_id: number;
  file_id?: number;
  template_id: number;
  language_id: number;
  body: string;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
  updated_by_name?: string;
  code?: string;
};
