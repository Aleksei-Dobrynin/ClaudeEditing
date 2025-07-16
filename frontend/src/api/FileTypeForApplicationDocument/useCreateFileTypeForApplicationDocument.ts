import http from "api/https";
import { FileTypeForApplicationDocument } from "../../constants/FileTypeForApplicationDocument";

export const createFileTypeForApplicationDocument = (data: FileTypeForApplicationDocument): Promise<any> => {
  return http.post(`/FileTypeForApplicationDocument/Create`, data);
};
