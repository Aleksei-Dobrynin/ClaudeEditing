import http from "api/https";
import { HrmsEventType } from "../../constants/HrmsEventType";

export const createHrmsEventType = (data: HrmsEventType): Promise<any> => {
  return http.post(`/HrmsEventType/Create`, data);
};
