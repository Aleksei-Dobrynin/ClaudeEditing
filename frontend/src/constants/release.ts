import { Dayjs } from "dayjs";

export type release = {
  
  id: number;
  updated_by?: number;
  number: string;
  description: string;
  description_kg: string;
  code: string;
  date_start: string;
  created_at?: Dayjs;
  updated_at?: Dayjs;
  created_by?: number;
  videos?: any[];
};
