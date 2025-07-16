import http from "api/https";
import { Service } from "../../constants/Service";

export const createService = (data: Service): Promise<any> => {
  return http.post(`/Service/Create`, data);
};
