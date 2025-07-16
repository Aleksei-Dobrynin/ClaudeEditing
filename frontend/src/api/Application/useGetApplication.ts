import http from "api/https";

export const getApplication = (id: number): Promise<any> => {
  return http.get(`/Application/GetOneById?id=${id}`);
};


export const checkCalucationForApplication = (application_id: number): Promise<any> => {
  return http.get(`/application/CheckCalucationForApplication?application_id=${application_id}`);
};