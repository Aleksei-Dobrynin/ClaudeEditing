import { Dayjs } from "dayjs";

export type DocumentJournals = {
  id: number;
  code: string;
  name: string;
  number_template: string;
  current_number: number;
  reset_period: string;
  last_reset: Dayjs;
  template_types: { id: number; order: number }[];
  period_type_id: number;
  status_ids: number[];
};
