import http from "api/https";
import { ApplicationFilterType } from "../../constants/ApplicationFilterType";

export const createApplicationFilterType = (data: ApplicationFilterType): Promise<any> => {
  return http.post(`/ApplicationFilterType/Create`, data);
};
