import http from "api/https";
import { TemplTypeAccessSurvey } from "constants/TemplTypeAccessSurvey";

export const createTemplTypeAccessSurvey = (data: TemplTypeAccessSurvey): Promise<any> => {
  return http.post(`/templ_type_access_survey`, data);
};
