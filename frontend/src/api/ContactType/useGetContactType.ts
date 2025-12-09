import http from "api/https";

export const getContactType = (id: number): Promise<any> => {
  return http.get(`/ContactType/GetOneById?id=${id}`);
};
