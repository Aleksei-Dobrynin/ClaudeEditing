import { Dayjs } from "dayjs";

export type reestr = {
  
  id: number;
  name: string;
  month: number;
  year: number;
  status_id: number;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
};
