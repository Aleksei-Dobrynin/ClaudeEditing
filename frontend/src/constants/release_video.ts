import { Dayjs } from "dayjs";

export type release_video = {
  
  id: number;
  release_id: number;
  file_id: number;
  name: string;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
};
