import http from "api/https";
import { Contragent } from "constants/Contragent";

export const saveContragent = (data: any): Promise<any> => {
  return http.post(`/attribute_type/AddOrUpdate`, data);
};
