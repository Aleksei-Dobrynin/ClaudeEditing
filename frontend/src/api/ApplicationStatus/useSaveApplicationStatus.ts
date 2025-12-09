import http from "api/https";
import { ApplicationStatus } from "constants/ApplicationStatus";

export const saveApplicationStatus = (data: any): Promise<any> => {
  return http.post(`/attribute_type/AddOrUpdate`, data);
};
