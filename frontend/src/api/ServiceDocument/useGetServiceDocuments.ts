import http from "api/https";

export const getServiceDocuments = (): Promise<any> => {
  return http.get("/ServiceDocument/GetAll");
};

export const getServiceDocumentsByService = (idService: number): Promise<any> => {
  return http.get(`/ServiceDocument/GetByidService?idService=${idService}`);
};
