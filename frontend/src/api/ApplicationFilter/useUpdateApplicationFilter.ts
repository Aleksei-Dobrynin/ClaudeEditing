import http from "api/https";
import { ApplicationFilter } from "../../constants/ApplicationFilter";

export const updateApplicationFilter = (data: ApplicationFilter): Promise<any> => {
  return http.put(`/ApplicationFilter/Update`, data);
};
