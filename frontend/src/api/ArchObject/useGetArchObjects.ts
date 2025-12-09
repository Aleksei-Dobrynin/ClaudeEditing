import http from "api/https";

export const getArchObjects = (): Promise<any> => {
  return http.get("/ArchObject/GetAll");
};
export const getArchObjectsBySearch = (text: string): Promise<any> => {
  return http.get(`/ArchObject/GetBySearch?text=${text}`);
};
export const getArchObjectsByAppId = (application_id: number): Promise<any> => {
  return http.get(`/ArchObject/GetByAppIdApplication?application_id=${application_id}`);
};