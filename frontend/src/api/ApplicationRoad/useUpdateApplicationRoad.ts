import http from "api/https";
import { ApplicationRoad } from "../../constants/ApplicationRoad";

export const updateApplicationRoad = (data: ApplicationRoad): Promise<any> => {
  return http.put(`/ApplicationRoad/Update`, data);
};
