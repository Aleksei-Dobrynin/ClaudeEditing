import http from "api/https";
import { CustomSubscribtion } from "../../constants/CustomSubscribtion";

export const createCustomSubscribtion = (data: CustomSubscribtion): Promise<any> => {
  return http.post(`/CustomSubscribtion/Create`, data);
};
