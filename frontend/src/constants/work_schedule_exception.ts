import { Dayjs } from "dayjs";

export type work_schedule_exception = {
  
  id: number;
  date_start: Dayjs;
  date_end: Dayjs;
  name: string;
  schedule_id: number;
  is_holiday: boolean;
  time_start: Dayjs;
  time_end: Dayjs;
};
