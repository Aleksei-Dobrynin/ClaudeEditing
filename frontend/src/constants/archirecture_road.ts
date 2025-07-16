import { Dayjs } from "dayjs";

export type archirecture_road = {
  
  id: number;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
  rule_expression: string;
  description: string;
  validation_url: string;
  post_function_url: string;
  is_active: boolean;
  from_status_id: number;
  to_status_id: number;
  created_at: Dayjs;
};
