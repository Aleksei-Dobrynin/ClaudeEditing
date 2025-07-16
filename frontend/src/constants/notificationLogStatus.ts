import { Dayjs } from "dayjs";

export type notificationLogStatus = {
  
  id: number;
  name: string;
  description: string;
  code: string;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
};
