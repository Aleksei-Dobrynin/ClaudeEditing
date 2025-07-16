import http from "api/https";

export const getCustomerRepresentatives = (): Promise<any> => {
  return http.get("/CustomerRepresentative/GetAll");
};

export const getCustomerRepresentativesByCustomer = (idCustomer: number): Promise<any> => {
  return http.get(`/CustomerRepresentative/GetByidCustomer?idCustomer=${idCustomer}`);
};
