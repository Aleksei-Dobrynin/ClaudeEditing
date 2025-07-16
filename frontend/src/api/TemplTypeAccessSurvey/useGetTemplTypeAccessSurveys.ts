import http from "api/https";

export const getTemplTypeAccessSurveys = (): Promise<any> => {
  return http.get("/templ_type_access_survey/GetAll");
};
