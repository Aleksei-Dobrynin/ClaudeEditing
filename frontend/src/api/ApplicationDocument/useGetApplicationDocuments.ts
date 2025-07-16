import http from "api/https";

export const getApplicationDocuments = (): Promise<any> => {
  return http.get("/ApplicationDocument/GetAll");
};

export const getApplicationDocumentsByServiceId = (service_id: number): Promise<any> => {
  return http.get(`/ApplicationDocument/GetByServiceId?service_id=${service_id}`);
};