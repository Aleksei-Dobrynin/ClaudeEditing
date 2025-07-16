import { Dayjs } from "dayjs";

export type ServiceStatusNumbering = {
    id: number;
    date_start: Dayjs;
    date_end: Dayjs;
    is_active: boolean;
    service_id: number;
    journal_id: number;
    number_template: string;
  };