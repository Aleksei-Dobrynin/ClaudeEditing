import { Dayjs } from "dayjs";

export type application_task_assignee = {
  
  id: number;
  structure_employee_id: number;
  application_task_id: number;
  created_at?: Dayjs;
  updated_at?: Dayjs;
  created_by?: number;
  updated_by?: number;
};
