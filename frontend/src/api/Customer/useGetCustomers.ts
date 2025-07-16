import http from "api/https";

export const getCustomers = (): Promise<any> => {
  return http.get("/Customer/GetAll");
};
export const getCustomersPagination = (pageSize: number, pageNumber: number, orderBy: string, orderType: string): Promise<any> => {
  return http.get(`/Customer/GetPaginated?pageSize=${pageSize}&pageNumber=${pageNumber}&orderBy=${orderBy}&orderType=${orderType}`);
};
export const getCustomersBySearch = (text: string): Promise<any> => {
  return http.get(`/Customer/BySearch?text=${text ?? ""}`);
};