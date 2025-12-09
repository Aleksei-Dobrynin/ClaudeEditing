import { Dayjs } from "dayjs";

export type JournalApplication = {
  
  id: number;
  journal_id: number;
  application_id: number;
  application_status_id: number;
  outgoing_number: string;
};
