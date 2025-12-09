import http from "api/https";
import { ArchiveObject } from "../../constants/ArchiveObject";

export const updateArchiveObject = (data: ArchiveObject): Promise<any> => {
  return http.put(`/ArchiveObject/Update`, data);
};

export const setDutyNumberToDuty = (from_duty_id: number, to_duty_id: number): Promise<any> => {
  return http.post(`/ArchiveObject/SetDutyNumberToDuty`, { from_duty_id, to_duty_id });
};
