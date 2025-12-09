import http from "api/https";
import dayjs from 'dayjs';
import { work_schedule } from "constants/work_schedule";

export const getincomes = (dateStart: dayjs.Dayjs, dateEnd: dayjs.Dayjs, number?: string, structures_ids?: number[]): Promise<any> => {
  const params = new URLSearchParams();
  params.append('dateStart', dateStart.format('YYYY-MM-DD'));
  params.append('dateEnd', dateEnd.format('YYYY-MM-DD'));
  if (number) params.append('number', number);
  if (structures_ids && structures_ids.length > 0) {
    structures_ids.forEach(id => {
      params.append('structures_ids', id.toString());
    });
  }
  return http.get(`/ApplicationPaidInvoice/GetPaidInvoices?${params.toString()}`);
};


