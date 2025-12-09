import { Dayjs } from "dayjs";

export type legal_act_object = {
  
  id: number;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
  id_act: number;
  id_object: number;
};
