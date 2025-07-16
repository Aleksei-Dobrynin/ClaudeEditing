import { Dayjs } from "dayjs";

export type SecurityEvent = {
  id: number;
  resolutionTime: Dayjs;
  resolutionNotes: string;
  eventType: string;
  eventDescription: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  eventTime: Dayjs;
  severityLevel: number;
  isResolved: boolean;
};