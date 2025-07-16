import http from "api/https";

export const getScheduleTypeAll = (): Promise<any> => {
  return http.get("/ScheduleType/GetAll");
};