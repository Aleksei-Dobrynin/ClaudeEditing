import http from "api/https";
import { DiscountDocumentType } from "../../constants/DiscountDocumentType";

export const createDiscountDocumentType = (data: DiscountDocumentType): Promise<any> => {
  return http.post(`/DiscountDocumentType/Create`, data);
};

export const getDiscountDocumentTypes = (): Promise<any> => {
  return http.get("/DiscountDocumentType/GetAll");
};

export const getDiscountDocumentType = (id: number): Promise<any> => {
  return http.get(`/DiscountDocumentType/GetOneById?id=${id}`);
};

export const updateDiscountDocumentType = (data: DiscountDocumentType): Promise<any> => {
  return http.put(`/DiscountDocumentType/Update`, data);
};

export const deleteDiscountDocumentType = (id: number): Promise<any> => {
  return http.remove(`/DiscountDocumentType/Delete?id=${id}`, {});
};



