import http from "api/https";
import { AttributeType } from "constants/AttributeType";

export const saveAttributeType = (data: AttributeType): Promise<any> => {
  return http.post(`/attribute_type/AddOrUpdate`, data);
};
