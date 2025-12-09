import { Dayjs } from "dayjs";

export type EmployeeEvent = {
  id: number;
  date_start: Dayjs;
  date_end: Dayjs;
  event_type_id: number;
  employee_id: number;
  temporary_employee_id?: number;
};
