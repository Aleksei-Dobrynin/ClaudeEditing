import { Dayjs } from "dayjs";

export type status_dutyplan_object = {
  
  id: number;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
  name: string;
  description: string;
  code: string;
  name_kg: string;
  description_kg: string;
  text_color: string;
  background_color: string;
  created_at: Dayjs;
};
