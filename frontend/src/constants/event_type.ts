import { Dayjs } from "dayjs";

export type event_type = {
  id: number;
  created_at?: Dayjs | string | null;
  updated_at?: Dayjs | string | null;
  created_by?: number | null;
  updated_by?: number | null;
  name: string;
  description: string;
  code: string;
  name_kg: string;
  description_kg: string;
};