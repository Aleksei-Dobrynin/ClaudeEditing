import http from "api/https";
import { District } from "../../constants/District";

export const updateDistrict = (data: District): Promise<any> => {
  return http.put(`/District/Update`, data);
};
