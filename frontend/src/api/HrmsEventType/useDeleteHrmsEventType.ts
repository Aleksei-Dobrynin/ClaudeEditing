import http from "api/https";

export const deleteHrmsEventType = (id: number): Promise<any> => {
  return http.remove(`/HrmsEventType/Delete?id=${id}`, {});
};
