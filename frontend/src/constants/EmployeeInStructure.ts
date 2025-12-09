import { Dayjs } from "dayjs";

export type EmployeeInStructure = {
  id: number;
  employee_id: number;
  date_start: Dayjs;
  date_end?: Dayjs;
  structure_id: number;
  post_id: number;
  is_temporary?: boolean;
};
