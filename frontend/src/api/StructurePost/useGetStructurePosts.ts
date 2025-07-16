import http from "api/https";

export const getStructurePosts = (): Promise<any> => {
  return http.get("/StructurePost/GetAll");
};