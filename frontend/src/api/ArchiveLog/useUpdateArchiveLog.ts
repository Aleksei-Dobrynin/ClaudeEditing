import http from "api/https";
import { ArchiveLog } from "../../constants/ArchiveLog";

export const updateArchiveLog = (data: ArchiveLog): Promise<any> => {
  return http.put(`/ArchiveLog/Update`, data);
};
