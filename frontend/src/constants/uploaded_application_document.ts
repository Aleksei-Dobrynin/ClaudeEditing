import { Dayjs } from "dayjs";

export type uploaded_application_document = {
  
  id: number;
  file_id: number;
  application_document_id: number;
  name: string;
  service_document_id: number;
  created_at: Dayjs;
  updated_at: Dayjs;
  created_by: number;
  updated_by: number;
  document_number: string;
};

export type UploadTemplate = {
  application_id: number;
  html: string;
  template_code: string;
};
