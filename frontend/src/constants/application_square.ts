import { Dayjs } from "dayjs";

export type application_square = {
  
  id: number;
  application_id: number;
  structure_id: number;
  unit_type_id: number;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
  vlue: string;
};
