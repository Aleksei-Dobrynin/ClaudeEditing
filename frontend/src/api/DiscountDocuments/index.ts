import http from "api/https";
import { DiscountDocuments } from "../../constants/DiscountDocuments";

export const createDiscountDocuments = (data: DiscountDocuments, file: any, fileName: string): Promise<any> => {
  const formData = new FormData();

  for (var key in data) {
    if (data[key] == null) continue;
    formData.append(key, data[key]);
  }
  formData.append("document.name", fileName);
  formData.append("document.file", file);

  return http.post(`/DiscountDocuments/Create`, formData);
};

export const getDiscountDocumentss = (): Promise<any> => {
  return http.get("/DiscountDocuments/GetAll");
};

export const getDiscountDocuments = (id: number): Promise<any> => {
  return http.get(`/DiscountDocuments/GetOneById?id=${id}`);
};

export const updateDiscountDocuments = (data: DiscountDocuments, file: any, fileName: string): Promise<any> => {
  const formData = new FormData();

  for (var key in data) {
    if (data[key] == null) continue;
    formData.append(key, data[key]);
  }
  formData.append("document.name", fileName);
  formData.append("document.file", file);

  return http.put(`/DiscountDocuments/Update`, data);
};

export const deleteDiscountDocuments = (id: number): Promise<any> => {
  return http.remove(`/DiscountDocuments/Delete?id=${id}`, {});
};



