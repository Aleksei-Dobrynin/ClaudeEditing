import { Dayjs } from "dayjs";

export type notification = {
  id: number;
  title: string;
  text: string;
  employee_id: number;
  user_id: number;
  has_read: boolean;
  created_at: Dayjs;
  code: string;
  link: string;
};
