import { Dayjs } from "dayjs";

export type structure_application_log = {
  
  id: number;
  created_by: number;
  updated_by: number;
  updated_at: Dayjs;
  created_at: Dayjs;
  structure_id: number;
  application_id: number;
  status: string;
  status_code: string;
};
