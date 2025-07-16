import { Dayjs } from "dayjs";

export type TemplRemindersDays = {
  id: number;
  name: string;
  projecttype_id: number;
  test: boolean;
  status_id: number;
  min_responses: number;
  date_end: Dayjs;
  access_link: string;
  entity_id: number;
  frequency_id: number;
  is_triggers_required: boolean;
  date_attribute_milestone_id: number;
};
