import http from "api/https";

export const getSmAttributeTriggersByProjectId = (project_id: number): Promise<any> => {
  return http.get(`/sm_attribute_triggers/GetByproject_id?project_id=${project_id}`);
};
