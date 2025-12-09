import http from "api/https";
import {ApplicationComments} from "../../constants/ApplicationComments";

export const updateComments = (data: ApplicationComments): Promise<any> => {
  return http.put(`/application_comment/${data.id}`, data);
};