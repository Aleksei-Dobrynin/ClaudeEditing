import http from "api/https";

export const getSmAttributeTrigger = (id: number): Promise<any> => {
  return http.get(`/sm_attribute_triggers/${id}`);
};
