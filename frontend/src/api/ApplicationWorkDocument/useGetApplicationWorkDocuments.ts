import http from "api/https";

export const getApplicationWorkDocuments = (): Promise<any> => {
  return http.get("/ApplicationWorkDocument/GetAll");
};

export const getApplicationWorkDocumentsByIDTask = (idTask: number): Promise<any> => {
  return http.get(`/ApplicationWorkDocument/GetByIDTask?idTask=${idTask}`);
};

export const getApplicationWorkDocumentsByIDApplication = (idApplication: number): Promise<any> => {
  return http.get(`/ApplicationWorkDocument/GetByIDApplication?idApplication=${idApplication}`);
};
