import http from "api/https";

export const getAttributeTypes = (): Promise<any> => {
  return http.get("/attribute_type/GetAll");
};
