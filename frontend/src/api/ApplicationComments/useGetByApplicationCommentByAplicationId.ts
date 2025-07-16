import http from "api/https";

export const getCommentsByApplicationId = (id): Promise<any> => {
  return http.get(`/application_comment/GetByapplication_id?application_id=${id}`);
};