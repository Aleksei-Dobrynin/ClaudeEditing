import { Dayjs } from "dayjs";

export type SmProjectFrequency = {
  id: number;
  cron: string;
  updated_at: Dayjs;
  created_at: Dayjs;
  updated_by: number;
  created_by: number;
};
