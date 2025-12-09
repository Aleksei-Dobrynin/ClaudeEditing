import { Dayjs } from "dayjs";

export type release_seen = {
  
  id: number;
  release_id: number;
  user_id: number;
  date_issued: Dayjs;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
};
