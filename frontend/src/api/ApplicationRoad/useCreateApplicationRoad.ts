import http from "api/https";
import { ApplicationRoad } from "../../constants/ApplicationRoad";

export const createApplicationRoad = (data: ApplicationRoad): Promise<any> => {
  return http.post(`/ApplicationRoad/Create`, data);
};
