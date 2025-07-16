import { Dayjs } from "dayjs";

export type application_subtask = {
  
  id: number;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
  application_id: number;
  subtask_template_id: number;
  name: string;
  status_id: number;
  progress: number;
  application_task_id: number;
  description: string;
  created_at: Dayjs;
};
