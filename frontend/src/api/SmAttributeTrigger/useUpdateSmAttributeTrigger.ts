import http from "api/https";
import { SmAttributeTrigger } from "constants/SmAttributeTrigger";

export const updateSmAttributeTrigger = (data: SmAttributeTrigger): Promise<any> => {
  return http.put(`/sm_attribute_triggers/${data.id}`, data);
};
