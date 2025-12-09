import http from "api/https";
import { ArchObject } from "../../constants/ArchObject";

export const createArchObject = (data: ArchObject): Promise<any> => {
  return http.post(`/ArchObject/Create`, data);
};
