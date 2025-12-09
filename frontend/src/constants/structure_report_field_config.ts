import { Dayjs } from "dayjs";

export type structure_report_field_config = {
  
  id: number;
  structureReportId: number;
  fieldName: string;
  reportItem: string;
  unitTypes?: number[] 
  // created_at: Dayjs;
  // updated_at: Dayjs;
  // created_by: number;
  // updated_by: number;
};
