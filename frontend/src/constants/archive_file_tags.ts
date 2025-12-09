import { Dayjs } from "dayjs";

export type archive_file_tags = {
  
  id: number;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
  file_id: number;
  tag_id: number;
};
