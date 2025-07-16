import http from "api/https";
import { unit_for_field_config } from "constants/unit_for_field_config";

export const createunit_for_field_config = (data: unit_for_field_config): Promise<any> => {
  return http.post(`/UnitForFieldConfig/Create`, data);
};

export const deleteunit_for_field_config = (id: number): Promise<any> => {
  return http.remove(`/UnitForFieldConfig/${id}`, {});
};

export const getunit_for_field_config = (id: number): Promise<any> => {
  return http.get(`/UnitForFieldConfig/${id}`);
};

export const getunit_for_field_configs = (): Promise<any> => {
  return http.get("/UnitForFieldConfig/GetAll");
};

export const updateunit_for_field_config = (data: unit_for_field_config): Promise<any> => {
  return http.put(`/UnitForFieldConfig/${data.id}`, data);
};


