import http from "api/https";

export const getSurveyTag = (id: number): Promise<any> => {
  return http.get(`/survey_tags/${id}`);
};
