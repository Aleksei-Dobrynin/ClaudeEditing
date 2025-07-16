import http from "api/https";
import { ExcelUpload } from "../../constants/ExcelUpload";

export const createExcelUpload = (data: ExcelUpload, file: any, fileName: string): Promise<any> => {

  const formData = new FormData();

  for (var key in data) {
    if (data[key] == null) continue;
    formData.append(key, data[key]);
  }
  formData.append("document.name", fileName);
  formData.append("document.file", file);


  return http.post(`/File/ReadExcel`, formData);
};
