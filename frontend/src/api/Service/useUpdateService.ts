import http from "api/https";
import { Service } from "../../constants/Service";

export const updateService = (data: Service): Promise<any> => {
  return http.put(`/Service/Update`, data);
};
