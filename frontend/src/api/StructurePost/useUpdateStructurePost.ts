import http from "api/https";
import { StructurePost } from "../../constants/StructurePost";

export const updateStructurePost = (data: StructurePost): Promise<any> => {
  return http.put(`/StructurePost/Update`, data);
};
