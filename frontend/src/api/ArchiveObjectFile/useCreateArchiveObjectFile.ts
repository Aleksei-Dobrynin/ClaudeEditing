import http from "api/https";
import { ArchiveObjectFile } from "../../constants/ArchiveObjectFile";

export const createArchiveObjectFile = (
  data: ArchiveObjectFile,
  file: any,
  fileName: string
): Promise<any> => {
  const formData = new FormData();

  for (var key in data) {
    if (data[key] == null) continue;
    formData.append(key, data[key]);
  }
  formData.append("document.name", fileName);
  formData.append("document.file", file);

  return http.post(`/ArchiveObjectFile/Create`, formData);
};

export const setTagsToFile = (tag_ids: number[], file_id: number): Promise<any> => {
  return http.post(`/ArchiveObjectFile/SetTagsToFile`, { tag_ids, file_id });
};

export const sendFilesToFolder = (file_ids: number[], folder_id: number): Promise<any> => {
  return http.post(`/ArchiveObjectFile/SendFilesToFolder`, { file_ids, folder_id });
};
