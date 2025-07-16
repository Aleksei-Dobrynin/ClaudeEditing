import http from "api/https";
import { FileTypeForApplicationDocument } from "../../constants/FileTypeForApplicationDocument";

export const updateFileTypeForApplicationDocument = (data: FileTypeForApplicationDocument): Promise<any> => {
  return http.put(`/FileTypeForApplicationDocument/Update`, data);
};
