import { Dayjs } from "dayjs";

export type CustomerRepresentative = {
  id: number;
  customer_id: number;
  last_name: string;
  pin: string;
  first_name: string;
  second_name: string;
  date_start: Dayjs;
  date_end: Dayjs;
  date_document: Dayjs;
  notary_number: string;
  requisites: string;
  contact: string;
  is_included_to_agreement: boolean;
};
