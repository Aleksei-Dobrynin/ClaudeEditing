import http from "api/https";
import { employee_contact } from "constants/employee_contact";

export const createemployee_contact = (data: employee_contact): Promise<any> => {
  return http.post(`/employee_contact`, data);
};

export const deleteemployee_contact = (id: number): Promise<any> => {
  return http.remove(`/employee_contact/${id}`, {});
};

export const getemployee_contact = (id: number): Promise<any> => {
  return http.get(`/employee_contact/${id}`);
};

export const getemployee_contacts = (): Promise<any> => {
  return http.get("/employee_contact/GetAll");
};

export const updateemployee_contact = (data: employee_contact): Promise<any> => {
  return http.put(`/employee_contact/${data.id}`, data);
};


export const getemployee_contactsByEmployee = (idEmployee: number): Promise<any> => {
  return http.get(`/employee_contact/GetByIDEmployee?idEmployee=${idEmployee}`);
};
