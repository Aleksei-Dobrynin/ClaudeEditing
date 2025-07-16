import { Dayjs } from "dayjs";

export type LawDocument = {
  id: number;
  name: string;
  data: Dayjs;
  description: string;
  type_id: number;
  link: string;
  name_kg: string;
  description_kg: string;
};
