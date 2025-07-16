import { Dayjs } from "dayjs";

export type application_legal_record = {
  
  id: number;
  id_application: number;
  id_legalrecord: number;
  id_legalact: number;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
};
