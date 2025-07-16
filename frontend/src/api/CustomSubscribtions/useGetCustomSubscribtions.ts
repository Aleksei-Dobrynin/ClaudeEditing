import http from "api/https";

export const getCustomSubscribtionAll = (): Promise<any> => {
  return http.get("/CustomSubscribtion/GetAll");
};

export const getCustomSubscribtionOne = (id: number): Promise<any> => {
  return http.get("/CustomSubscribtion/GetOneById?id=" + id);
};

export const getCustomSubscribtionByIdEmployee = (id: number): Promise<any> => {
  return http.get("/CustomSubscribtion/GetByIdEmployee?id=" + id);
};