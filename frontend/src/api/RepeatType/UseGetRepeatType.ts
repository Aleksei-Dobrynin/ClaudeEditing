import http from "api/https";

export const getRepeatTypeAll = (): Promise<any> => {
  return http.get("/RepeatType/GetAll");
};