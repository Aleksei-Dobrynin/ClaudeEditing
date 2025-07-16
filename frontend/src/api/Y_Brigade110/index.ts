import http from "api/https";
import { Y_Brigade110 } from "constants/Y_Brigade110";

export const createY_Brigade110 = (data: Y_Brigade110): Promise<any> => {
  return http.post(`/Y_Brigade110`, data);
};

export const deleteY_Brigade110 = (id: number): Promise<any> => {
  return http.remove(`/Y_Brigade110/${id}`, {});
};

export const getY_Brigade110 = (id: number): Promise<any> => {
  return http.get(`/Y_Brigade110/${id}`);
};

export const getY_Brigade110s = (): Promise<any> => {
  return http.get("/Y_Brigade110/GetAll");
};

export const updateY_Brigade110 = (data: Y_Brigade110): Promise<any> => {
  return http.put(`/Y_Brigade110/${data.id}`, data);
};


export const getY_Brigade110sByidCard = (idCard: number): Promise<any> => {
  return http.get(`/Y_Brigade110/GetByidCard?idCard=${idCard}`);
};
