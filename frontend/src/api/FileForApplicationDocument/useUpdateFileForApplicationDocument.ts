import http from "api/https";
import { FileForApplicationDocument } from "../../constants/FileForApplicationDocument";

export const updateFileForApplicationDocument = (data: FileForApplicationDocument, file: any, fileName: string): Promise<any> => {
  
  const formData = new FormData();
  
  for (var key in data) {
    if (data[key] == null) continue;
    formData.append(key, data[key]);
  }
  formData.append("document.name", fileName);
  formData.append("document.file", file);


  return http.put(`/FileForApplicationDocument/Update`, formData);
};
