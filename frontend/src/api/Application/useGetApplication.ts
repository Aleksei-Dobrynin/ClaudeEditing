import http from "api/https";

export const getApplication = (id: number): Promise<any> => {
  return http.get(`/Application/GetOneById?id=${id}`);
};


export const checkCalucationForApplication = (application_id: number): Promise<any> => {
  return http.get(`/application/CheckCalucationForApplication?application_id=${application_id}`);
};

export const addToFavorite = (id: number): Promise<any> => {
  return http.post(`/Application/AddToFavorite`, { application_id: id });
};

export const deleteToFavorite = (id: number): Promise<any> => {
  return http.post(`/Application/DeleteToFavorite`, { application_id: id });
};

export const getStatusFavorite = (id: number): Promise<any> => {
  return http.get(`/Application/GetStatusFavorite?application_id=${id}`);
};