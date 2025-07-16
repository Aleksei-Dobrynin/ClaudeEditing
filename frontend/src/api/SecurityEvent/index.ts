import http from "api/https";
import { SecurityEvent } from "constants/SecurityEvent";

export const getSecurityEvents = (): Promise<any> => {
  return http.get("/SecurityEvent/GetAll");
};

