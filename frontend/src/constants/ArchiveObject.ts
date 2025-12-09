import { Dayjs } from "dayjs";
import { CustomersForArchiveObject } from "./CustomersForArchiveObject";

export type ArchiveObject = {
  id: number;
  doc_number: string;
  address: string;
  customer: string;
  customers_for_archive_object: CustomersForArchiveObject[];
  latitude: number;
  longitude: number;
  layer: string;
  date_setplan: Dayjs;
  quantity_folder: number;
  status_dutyplan_object_id: number;
};
