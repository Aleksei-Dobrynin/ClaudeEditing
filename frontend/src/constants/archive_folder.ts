import { Dayjs } from "dayjs";

export type archive_folder = {
  
  id: number;
  archive_folder_name: string;
  dutyplan_object_id: number;
  folder_location: string;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
};
