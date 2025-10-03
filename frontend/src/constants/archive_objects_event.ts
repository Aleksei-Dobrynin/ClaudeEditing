import { Dayjs } from "dayjs";

export type archive_objects_event = {
  id: number;
  description?: string | null;
  employee_id?: number | null;
  head_structure_id?: number | null;
  created_at?: Dayjs | string | null;
  updated_at?: Dayjs | string | null;
  created_by?: number | null;
  updated_by?: number | null;
  archive_object_id?: number | null;
  event_type_id?: number | null;
  event_date?: Dayjs | string | null;
  structure_id?: number | null;
  application_id?: number | null;
  
  // Дополнительные поля для отображения связанных данных (заполняются на бэкенде)
  employee_name?: string;
  head_structure_name?: string;
  archive_object_name?: string;
  event_type_name?: string;
  structure_name?: string;
  application_number?: string;
};