import http from "api/https";

export const getArchObjectTag = (id: number): Promise<any> => {
  return http.get(`/arch_object_tag/GetByIDObject?idObject=${id}`);
};
