import http from "api/https";
import { ArchiveLogStatus } from "../../constants/ArchiveLogStatus";

export const createArchiveLogStatus = (data: ArchiveLogStatus): Promise<any> => {
  return http.post(`/ArchiveLogStatus/Create`, data);
};
