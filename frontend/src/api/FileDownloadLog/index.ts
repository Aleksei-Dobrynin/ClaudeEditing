import http from "api/https";
import { release } from "constants/release";

export const getFileDownloadLogs = (): Promise<any> => {
  return http.get("/File/GetFileLog");
};