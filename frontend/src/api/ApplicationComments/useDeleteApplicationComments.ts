import http from "api/https";

export const deleteComments = (id: number): Promise<any> => {
  return http.remove(`/application_comment/${id}`, {});
};



