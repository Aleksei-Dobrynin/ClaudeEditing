import { Dayjs } from "dayjs";

export type legal_record_registry = {
  
  id: number;
  is_active: boolean;
  defendant: string;
  id_status: number;
  subject: string;
  complainant: string;
  decision: string;
  addition: string;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
  
};
