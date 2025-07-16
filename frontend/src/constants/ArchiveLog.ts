import dayjs, { Dayjs } from "dayjs";

export type ArchiveLog = {
  id: number;
  doc_number: string;
  address: string;
  status_id: number;
  date_return: Dayjs | null;
  take_structure_id: number;
  take_employee_id: number;
  return_structure_id: number;
  return_employee_id: number;
  date_take: Dayjs | null;
  name_take: string;
  deadline: Dayjs | null;
  archive_folder_id: number;
  // archiveObjects: { id: number | null; doc_number: string; address: string }[];
};
