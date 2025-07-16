import http from "api/https";
import { ArchiveLogStatus } from "../../constants/ArchiveLogStatus";

export const updateArchiveLogStatus = (data: ArchiveLogStatus): Promise<any> => {
  return http.put(`/ArchiveLogStatus/Update`, data);
};
