import http from "api/https";
import { unit_type } from "constants/unit_type";

export const createunit_type = (data: unit_type): Promise<any> => {
  return http.post(`/UnitType/Create`, data);
};

export const deleteunit_type = (id: number): Promise<any> => {
  return http.remove(`/UnitType/${id}`, {});
};

export const getunit_type = (id: number): Promise<any> => {
  return http.get(`/UnitType/${id}`);
};

export const getunit_types = (): Promise<any> => {
  return http.get("/UnitType/GetAll");
};

export const getunit_typesSquare = (): Promise<any> => {
  return http.get("/UnitType/GetAllSquare");
};

export const updateunit_type = (data: unit_type): Promise<any> => {
  return http.put(`/UnitType/${data.id}`, data);
};


