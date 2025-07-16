import { Dayjs } from "dayjs";

export type DiscountDocuments = {
  id: number;
  file_id: number;
  description: string;
  discount: number;
  discount_type_id: number;
  document_type_id: number;
  start_date: Dayjs;
  end_date: Dayjs;
};
