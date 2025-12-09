import { Dayjs } from "dayjs";

export type Workflow = {
  id: number;
  name: string;
  is_active: boolean;
  date_start: string | null;
  date_end: string | null;
};
