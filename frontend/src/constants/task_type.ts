import { Dayjs } from "dayjs";

export type task_type = {
  
  id: number;
  name: string;
  code: string;
  description: string;
  is_for_task: boolean;
  is_for_subtask: boolean;
  icon_color: string;
  svg_icon_id: number;
};
