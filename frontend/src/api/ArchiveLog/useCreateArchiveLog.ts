import http from "api/https";
import { ArchiveLog } from "../../constants/ArchiveLog";

export const createArchiveLog = (data: ArchiveLog): Promise<any> => {
  return http.post(`/ArchiveLog/Create`, data);
};
