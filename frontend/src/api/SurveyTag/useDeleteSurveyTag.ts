import http from "api/https";

export const deleteSurveyTag = (id: number): Promise<any> => {
  return http.remove(`/survey_tags/${id}`, {});
};
