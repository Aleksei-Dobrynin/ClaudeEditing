import { Dayjs } from "dayjs";

export type legal_object = {
  
  id: number;
  description: string;
  address: string;
  geojson: string;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
};
