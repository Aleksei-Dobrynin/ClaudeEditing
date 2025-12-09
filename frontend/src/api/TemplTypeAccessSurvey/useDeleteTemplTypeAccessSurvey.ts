import http from "api/https";

export const deleteTemplTypeAccessSurvey = (id: number): Promise<any> => {
  return http.remove(`/templ_type_access_survey/${id}`, {});
};
