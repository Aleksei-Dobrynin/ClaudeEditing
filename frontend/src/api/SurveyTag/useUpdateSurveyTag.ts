import http from "api/https";
import { SurveyTag } from "constants/SurveyTag";

export const updateSurveyTag = (data: SurveyTag): Promise<any> => {
  return http.put(`/survey_tags/${data.id}`, data);
};
