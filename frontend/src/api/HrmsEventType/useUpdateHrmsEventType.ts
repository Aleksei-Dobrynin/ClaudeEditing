import http from "api/https";
import { HrmsEventType } from "../../constants/HrmsEventType";

export const updateHrmsEventType = (data: HrmsEventType): Promise<any> => {
  return http.put(`/HrmsEventType/Update`, data);
};
