import { Dayjs } from "dayjs";

export type legal_record_object = {
  
  id: number;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
  id_record: number;
  id_object: number;
};
