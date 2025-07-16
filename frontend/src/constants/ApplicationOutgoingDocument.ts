import { Dayjs } from "dayjs";

export type ApplicationOutgoingDocument = {
  
  id: number;
  application_id: number;
  outgoing_number: string;
  issued_to_customer: boolean;
  issued_at: Dayjs;
  signed_ecp: boolean;
  signature_data: string;
  journal_id: number;
};
