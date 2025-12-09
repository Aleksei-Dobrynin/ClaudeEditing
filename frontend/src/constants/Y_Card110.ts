import { Dayjs } from "dayjs";

export type Y_Card110 = {
  
  id: number;
  arrivalBrigade: Dayjs;
  completedBrigade: Dayjs;
  arrivalBrigadePermanent: Dayjs;
  startTransportation: Dayjs;
  endTransportation: Dayjs;
  number: string;
  fioPatient: string;
  fioDoctor: string;
  address: string;
  dateBirth: Dayjs;
  idSpecialityDoctor: number;
  idStatus: number;
  exitBrigade: Dayjs;
};
