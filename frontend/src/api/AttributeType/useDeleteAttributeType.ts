import http from "api/https";

export const deleteAttributeType = (id: number): Promise<any> => {
  return http.remove(`/attribute_type/${id}`, {});
};
