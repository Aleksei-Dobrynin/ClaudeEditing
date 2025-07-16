import http from "api/https";

export const deleteCustomerRepresentative = (id: number): Promise<any> => {
  return http.remove(`/CustomerRepresentative/Delete?id=${id}`, {});
};
