import http from "api/https";

export const deleteSmAttributeTrigger = (id: number): Promise<any> => {
  return http.remove(`/sm_attribute_triggers/${id}`, {});
};
