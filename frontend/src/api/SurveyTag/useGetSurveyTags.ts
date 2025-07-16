import http from "api/https";

export const getSurveyTags = (): Promise<any> => {
  return http.get("/survey_tags/GetAll");
};
