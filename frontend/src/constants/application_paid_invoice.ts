import { Dayjs } from "dayjs";

export type application_paid_invoice = {
  
  id: number;
  date: string;
  payment_identifier: string;
  sum: number;
  application_id: number;
  bank_identifier: string;
};
