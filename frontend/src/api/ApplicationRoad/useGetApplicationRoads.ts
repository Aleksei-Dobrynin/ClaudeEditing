import http from "api/https";

export const getApplicationRoads = (): Promise<any> => {
  return http.get("/ApplicationRoad/GetAll");
};