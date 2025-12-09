import http from "api/https";
import { ContactType } from "constants/ContactType";

export const updateContactType = (data: ContactType): Promise<any> => {
  return http.put(`/ContactType/Update`, data);
};
