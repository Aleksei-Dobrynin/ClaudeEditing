import dayjs, { Dayjs } from "dayjs";

export type application_payment = {
  
  id: number;
  application_id: number;
  description: string;
  sum: number;
  structure_id: number;
  sum_wo_discount: number;
  discount_percentage: number;
  discount_value: number;
  reason: string;
  file_id?: number;
  nds?: number;
  nds_value?: number;
  nsp?: number;
  nsp_value?: number;
  head_structure_id?: number;
  implementer_id?: number;
  idTask?: number;
};

export type application_payment_sum_request = {
  dateStart:Dayjs;
  dateEnd: Dayjs;
  structures_id: number[];
}
