import http from "api/https";
import { Tag } from "constants/Tag";

export const updateTag = (data: Tag): Promise<any> => {
  return http.put(`/Tag/${data.id}`, data);
};
