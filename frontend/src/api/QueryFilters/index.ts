import http from "api/https";
import { QueryFilters } from "../../constants/QueryFilters";

export const createQueryFilters = (data: QueryFilters): Promise<any> => {
  return http.post(`/QueryFilters/Create`, data);
};

export const getQueryFilterss = (): Promise<any> => {
  return http.get("/QueryFilters/GetAll");
};

export const getAppTaskFilters = (): Promise<any> => {
  return http.get("/QueryFilters/GetAppTaskFilters");
};

export const getQueryFilters = (id: number): Promise<any> => {
  return http.get(`/QueryFilters/GetOneById?id=${id}`);
};

export const updateQueryFilters = (data: QueryFilters): Promise<any> => {
  return http.put(`/QueryFilters/Update`, data);
};

export const deleteQueryFilters = (id: number): Promise<any> => {
  return http.remove(`/QueryFilters/Delete?id=${id}`, {});
};



