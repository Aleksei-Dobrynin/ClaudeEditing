import { Dayjs } from "dayjs";

export type TechDecision = {
  id: number; 
  name: string; 
  code: string; 
  description: string; 
  name_kg: string; 
  description_kg: string; 
  text_color: string; 
  background_color: string; 
  created_at: Dayjs; 
  updated_at: Dayjs; 
  created_by: number | null; 
  updated_by: number | null; 
};