import http from "api/https";
import { TemplTypeAccessSurvey } from "constants/TemplTypeAccessSurvey";

export const updateTemplTypeAccessSurvey = (data: TemplTypeAccessSurvey): Promise<any> => {
  return http.put(`/templ_type_access_survey/${data.id}`, data);
};
