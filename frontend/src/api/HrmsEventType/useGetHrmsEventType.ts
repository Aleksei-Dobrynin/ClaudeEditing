import http from "api/https";

export const getHrmsEventType = (id: number): Promise<any> => {
  return http.get(`/HrmsEventType/GetOneById?id=${id}`);
};
