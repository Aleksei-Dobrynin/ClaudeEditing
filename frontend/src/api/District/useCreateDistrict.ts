import http from "api/https";
import { District } from "../../constants/District";

export const createDistrict = (data: District): Promise<any> => {
  return http.post(`/District/Create`, data);
};
