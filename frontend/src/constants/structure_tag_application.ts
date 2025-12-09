import { Dayjs } from "dayjs";

export type structure_tag_application = {
  
  id: number;
  structure_tag_id: number;
  application_id: number;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
  structure_id: number;
};
