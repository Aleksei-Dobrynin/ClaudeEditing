import { ApplicationDocument } from "./ApplicationDocument";
import { S_DocumentTemplate } from "./S_DocumentTemplate";
import { SubscribtionContactType } from "./SubscribtionContactType";

export type CustomSubscribtion = {
  id: number;
  idSubscriberType?: number;
  idSchedule?: number;
  idRepeatType?: number;
  sendEmpty?: boolean;
  isActive?: boolean;
  dayStart?: string;
  timeStart?: string;
  activeDateEnd?: string;
  activeDateStart?: string;
  timeEnd?: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  dateOfMonth?: number;
  weekOfMonth?: number;
  idDocument? : number;

  monthIsWeekDay?: boolean;
  weekDay?: string;
  body: string;
  title?: string
  idEmployee?: number
  idStructurePost?: number

  idSubscriberTypeNav?: SubscriberTypeNav;
  idScheduleNav?: ScheduleNav;
  idRepeatTypeNav?: RepeatTypeNav;
  idDocumentNav?: S_DocumentTemplate;
  SubscribtionContactType?: SubscribtionContactType;
  idSubscribtionContactType?: SubscribtionContactType;
};

export type SubscriberTypeNav = {
  id?: number;
  name?: string;
  code?: string;
  description?: string;
};

export type ScheduleNav = {
  id?: number;
  name?: string;
  code?: string;
  description?: string;
  repeatTypes?: []
};

export type RepeatTypeNav = {
  id?: number;
  name?: string;
  code?: string;
  isPeriod?: boolean;
  repeatIntervalMinutes?: number;
};