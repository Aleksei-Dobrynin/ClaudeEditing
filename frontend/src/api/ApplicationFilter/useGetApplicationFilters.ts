import http from "api/https";

export const getApplicationFilters = (): Promise<any> => {
  return http.get("/ApplicationFilter/GetAll");
};

export const getApplicationFiltersForDashboard = (): Promise<any> => {
  return http.get("/ApplicationFilter/GetFilters");
};