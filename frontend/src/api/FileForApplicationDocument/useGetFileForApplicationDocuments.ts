import http from "api/https";

export const getFileForApplicationDocuments = (): Promise<any> => {
  return http.get("/FileForApplicationDocument/GetAll");
};

export const getFileForApplicationDocumentsByDocument = (idDocument: number): Promise<any> => {
  return http.get(`/FileForApplicationDocument/GetByidDocument?idDocument=${idDocument}`);
};