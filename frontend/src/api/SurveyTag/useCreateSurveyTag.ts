import http from "api/https";
import { SurveyTag } from "constants/SurveyTag";

export const createSurveyTag = (data: SurveyTag): Promise<any> => {
  return http.post(`/survey_tags`, data);
};
