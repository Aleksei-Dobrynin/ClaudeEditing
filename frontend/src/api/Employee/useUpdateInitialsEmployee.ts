import http from "api/https";

export const updateInitials = (data: any): Promise<any> => {
  return http.put(`/Employee/UpdateInitials`, data);
};
