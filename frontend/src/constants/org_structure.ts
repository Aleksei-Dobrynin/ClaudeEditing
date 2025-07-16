import { Dayjs } from "dayjs";

export type org_structure = {
  
  id: number;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
  parent_id: number;
  unique_id: string;
  name: string;
  version: number;
  is_active: boolean;
  date_start: Dayjs;
  date_end: Dayjs;
  remote_id: string;
  short_name: string;
};
