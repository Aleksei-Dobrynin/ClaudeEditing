import http from "api/https";
import { CustomSubscribtion } from "../../constants/CustomSubscribtion";

export const updateCustomSubscribtion = (data: CustomSubscribtion): Promise<any> => {
  return http.put(`/CustomSubscribtion/Update`, data);
};