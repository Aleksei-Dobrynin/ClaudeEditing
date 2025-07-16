import { Dayjs } from "dayjs";

export type work_day = {
  
  id: number;
  week_number: number;
  time_start: Dayjs;
  time_end: Dayjs;
  schedule_id: number;
};
