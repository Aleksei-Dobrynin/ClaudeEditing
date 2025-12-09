import { Dayjs } from "dayjs";

// dictionaries
export const getFormattedDateToDashboard = (date: Dayjs): string => {
  return date.format('YYYY-MM-DD');
};