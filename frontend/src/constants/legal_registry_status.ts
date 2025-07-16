import { Dayjs } from "dayjs";

export type legal_registry_status = {
  
  id: number;
  description_kg: string;
  text_color: string;
  background_color: string;
  name: string;
  description: string;
  code: string;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
  name_kg: string;
};
