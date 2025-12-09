import http from "api/https";

export const getHrmsEventTypes = (): Promise<any> => {
  return http.get("/HrmsEventType/GetAll");
};