import { Dayjs } from "dayjs";

export type path_step = {
  
  id: number;
  step_type: string;
  path_id: number;
  responsible_org_id: number;
  name: string;
  description: string;
  order_number: number;
  is_required: boolean;
  estimated_days: number;
  wait_for_previous_steps: boolean;
};
