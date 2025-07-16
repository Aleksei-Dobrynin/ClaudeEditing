import http from "api/https";
import { ApplicationFilterType } from "../../constants/ApplicationFilterType";

export const updateApplicationFilterType = (data: ApplicationFilterType): Promise<any> => {
  return http.put(`/ApplicationFilterType/Update`, data);
};
