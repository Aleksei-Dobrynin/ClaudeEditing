import http from "api/https";
import {ApplicationComments} from "../../constants/ApplicationComments";

export const createComments = (data: ApplicationComments): Promise<any> => {
  return http.post(`/application_comment/Create`, data);
};