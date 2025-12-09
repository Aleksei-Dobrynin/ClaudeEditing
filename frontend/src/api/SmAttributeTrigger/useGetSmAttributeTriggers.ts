import http from "api/https";

export const getSmAttributeTriggers = (): Promise<any> => {
  return http.get("/sm_attribute_triggers/GetAll");
};
