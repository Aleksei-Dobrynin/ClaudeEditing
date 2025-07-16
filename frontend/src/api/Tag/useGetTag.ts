import http from "api/https";

export const getTag = (id: number): Promise<any> => {
  return http.get(`/Tag/${id}`);
};
