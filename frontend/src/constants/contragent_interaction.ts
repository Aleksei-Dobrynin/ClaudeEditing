import { Dayjs } from "dayjs";

export type contragent_interaction = {
  
  id: number;
  updated_by: number;
  application_id: number;
  task_id: number;
  contragent_id: number;
  description: string;
  progress: number;
  name: string;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
};
