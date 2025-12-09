import http from "api/https";
import { customer_contact } from "constants/customer_contact";

export const createcustomer_contact = (data: customer_contact): Promise<any> => {
  return http.post(`/customer_contact`, data);
};

export const deletecustomer_contact = (id: number): Promise<any> => {
  return http.remove(`/customer_contact/${id}`, {});
};

export const getcustomer_contact = (id: number): Promise<any> => {
  return http.get(`/customer_contact/${id}`);
};

export const getcustomer_contacts = (): Promise<any> => {
  return http.get("/customer_contact/GetAll");
};

export const updatecustomer_contact = (data: customer_contact): Promise<any> => {
  return http.put(`/customer_contact/${data.id}`, data);
};


export const getcustomer_contactsBycustomer_id = (customer_id: number): Promise<any> => {
  return http.get(`/customer_contact/GetBycustomer_id?customer_id=${customer_id}`);
};
