import http from "api/https";
import { CustomSvgIcon } from "constants/CustomSvgIcon";

export const createCustomSvgIcon = (data: CustomSvgIcon): Promise<any> => {
  return http.post(`/CustomSvgIcon`, data);
};

export const deleteCustomSvgIcon = (id: number): Promise<any> => {
  return http.remove(`/CustomSvgIcon/${id}`, {});
};

export const getCustomSvgIcon = (id: number): Promise<any> => {
  return http.get(`/CustomSvgIcon/${id}`);
};

export const getCustomSvgIcons = (): Promise<any> => {
  return http.get("/CustomSvgIcon/GetAll");
};

export const updateCustomSvgIcon = (data: CustomSvgIcon): Promise<any> => {
  return http.put(`/CustomSvgIcon/${data.id}`, data);
};


