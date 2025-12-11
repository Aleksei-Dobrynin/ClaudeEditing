import http from "api/https";

export const getComments = (): Promise<any> => {
  return http.get(`/application_comment/GetAll`);
};

export const getCommentType = (): Promise<any> => {
  return http.get("/CommentType/GetAll");
};

export const getMyAssigned = (): Promise<any> => {
  return http.get("/application_comment/MyAssigned");
};

export const completeComment = (id): Promise<any> => {
  return http.get("/application_comment/CompleteComment?id=" + id);
};