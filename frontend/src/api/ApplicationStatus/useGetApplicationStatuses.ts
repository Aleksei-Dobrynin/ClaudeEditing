import http from "api/https";

export const getApplicationStatuss = (): Promise<any> => {
  return http.get("/ApplicationStatus/GetAll");
};
