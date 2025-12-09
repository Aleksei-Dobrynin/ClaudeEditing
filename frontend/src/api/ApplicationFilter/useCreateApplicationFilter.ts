import http from "api/https";
import { ApplicationFilter } from "../../constants/ApplicationFilter";

export const createApplicationFilter = (data: ApplicationFilter): Promise<any> => {
  return http.post(`/ApplicationFilter/Create`, data);
};
