import http from "api/https";
import { StructurePost } from "../../constants/StructurePost";

export const createStructurePost = (data: StructurePost): Promise<any> => {
  return http.post(`/StructurePost/Create`, data);
};
