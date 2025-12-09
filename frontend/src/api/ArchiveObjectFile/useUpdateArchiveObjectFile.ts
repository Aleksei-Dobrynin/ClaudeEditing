import http from "api/https";
import { ArchiveObjectFile } from "../../constants/ArchiveObjectFile";

export const updateArchiveObjectFile = (data: ArchiveObjectFile, file: any, fileName: string): Promise<any> => {

  const formData = new FormData();

  for (var key in data) {
    if (data[key] == null) continue;
    formData.append(key, data[key]);
  }
  formData.append("document.name", fileName);
  formData.append("document.file", file);

  return http.put(`/ArchiveObjectFile/Update`, data);
};
