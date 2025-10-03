import { Dayjs } from "dayjs";

export type ServiceStatusNumbering = {
    id: number;
    date_start: string;
    date_end: string;
    is_active: boolean;
    service_id: number;
    journal_id: number;
    number_template: string;
  };