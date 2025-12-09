import http from "api/https";
import { ApplicationWorkDocument } from "constants/ApplicationWorkDocument";

export const createApplicationWorkDocument = (data: ApplicationWorkDocument, fileName: string, file: any): Promise<any> => {
  const formData = new FormData();

  for (var key in data) {
    if (data[key] == null) continue;
    formData.append(key, data[key]);
  }
  formData.append("document.name", fileName);
  formData.append("document.file", file);
  return http.post(`/ApplicationWorkDocument/AddDocument`, formData);
};

export const setApplicationDocument = (id: number, file, fileName: string, comment: string): Promise<any> => {
  const formData = new FormData();
  formData.append("id", id.toString());
  formData.append("comment", comment);
  formData.append("document.file", file);
  formData.append("document.name", fileName);
  return http.post(`/ApplicationWorkDocument/SetFileToDocument`, formData);
};

export const createApplicationWorkDocumentFromTemplate = (data: any): Promise<any> => {
  return http.post(`/ApplicationWorkDocument/AddDocumentFromTemplate`, data);
};

export const sendApplicationDocumentToemail = (data: any): Promise<any> => {
  return http.post(`/ApplicationWorkDocument/SendDocumentsToEmail`, data);
};
