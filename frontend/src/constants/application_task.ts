import { Dayjs } from "dayjs";

export type application_task = {
  
  id: number;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
  structure_id: number;
  application_id: number;
  task_template_id: number;
  comment: string;
  name: string;
  is_required: boolean;
  order: number;
  status_id: number;
  progress: number;
};
