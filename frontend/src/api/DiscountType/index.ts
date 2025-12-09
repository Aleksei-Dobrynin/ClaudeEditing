import http from "api/https";
import { DiscountType } from "../../constants/DiscountType";

export const createDiscountType = (data: DiscountType): Promise<any> => {
  return http.post(`/DiscountType/Create`, data);
};

export const getDiscountTypes = (): Promise<any> => {
  return http.get("/DiscountType/GetAll");
};

export const getDiscountType = (id: number): Promise<any> => {
  return http.get(`/DiscountType/GetOneById?id=${id}`);
};

export const updateDiscountType = (data: DiscountType): Promise<any> => {
  return http.put(`/DiscountType/Update`, data);
};

export const deleteDiscountType = (id: number): Promise<any> => {
  return http.remove(`/DiscountType/Delete?id=${id}`, {});
};



