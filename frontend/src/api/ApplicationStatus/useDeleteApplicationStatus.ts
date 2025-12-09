import http from "api/https";

export const deleteApplicationStatus = (id: number): Promise<any> => {
  return http.remove(`/attribute_type/${id}`, {});
};
