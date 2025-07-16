import http from "api/https";

export const deleteContragent = (id: number): Promise<any> => {
  return http.remove(`/attribute_type/${id}`, {});
};
