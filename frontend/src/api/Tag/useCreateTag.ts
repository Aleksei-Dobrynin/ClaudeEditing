import http from "api/https";
import { Tag } from "constants/Tag";

export const createTag = (data: Tag): Promise<any> => {
  return http.post(`/Tag/Create`, data);
};
