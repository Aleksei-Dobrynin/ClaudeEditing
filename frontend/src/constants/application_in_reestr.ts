import { Dayjs } from "dayjs";

export type application_in_reestr = {
  
  id: number;
  reestr_id: number;
  application_id: number;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
};
