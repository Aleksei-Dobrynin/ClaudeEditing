import http from "api/https";

export const deleteCustomer = (id: number): Promise<any> => {
  return http.remove(`/Customer/Delete?id=${id}`, {});
};
