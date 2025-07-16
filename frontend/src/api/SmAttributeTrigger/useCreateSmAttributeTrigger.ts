import http from "api/https";
import { SmAttributeTrigger } from "constants/SmAttributeTrigger";

export const createSmAttributeTrigger = (data: SmAttributeTrigger): Promise<any> => {
  return http.post(`/sm_attribute_triggers`, data);
};
