import http from "api/https";
import { ContactType } from "constants/ContactType";

export const createContactType = (data: ContactType): Promise<any> => {
  return http.post(`/ContactType/Create`, data);
};
