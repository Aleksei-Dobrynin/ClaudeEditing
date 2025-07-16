import { Dayjs } from "dayjs";

export type Service = {
  id: number;
  name: string;
  short_name: string;
  code: string;
  description: string;
  day_count: number;
  workflow_id: number;
  law_document_id: number;
  price: number;
  is_active: boolean;
  date_start: Dayjs;
  date_end: Dayjs;
  structure_id: number;
};
