import { Dayjs } from "dayjs";

export type step_dependency = {
  
  id: number;
  dependent_step_id: number;
  prerequisite_step_id: number;
  is_strict: boolean;
};
