import http from "api/https";

export const getTemplTypeAccessSurvey = (id: number): Promise<any> => {
  return http.get(`/templ_type_access_survey/${id}`);
};
