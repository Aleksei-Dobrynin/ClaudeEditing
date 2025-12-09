import { Dayjs } from "dayjs";

export type legal_act_registry = {
  
  id: number;
  is_active: boolean;
  act_type: string;
  date_issue: Dayjs;
  id_status: number;
  subject: string;
  act_number: string;
  decision: string;
  addition: string;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
};
