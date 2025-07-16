import http from "api/https";
import { structure_tag_application } from "constants/structure_tag_application";

export const createstructure_tag_application = (data: structure_tag_application): Promise<any> => {
  return http.post(`/structure_tag_application`, data);
};

export const deletestructure_tag_application = (id: number): Promise<any> => {
  return http.remove(`/structure_tag_application/${id}`, {});
};

export const getstructure_tag_application = (id: number): Promise<any> => {
  return http.get(`/structure_tag_application/${id}`);
};

export const getstructure_tag_applications = (): Promise<any> => {
  return http.get("/structure_tag_application/GetAll");
};

export const updatestructure_tag_application = (data: structure_tag_application): Promise<any> => {
  return http.put(`/structure_tag_application/${data.id}`, data);
};


export const getstructure_tag_applicationsBy = (structure_id: number): Promise<any> => {
  return http.get(`/structure_tag_application/GetBystructure_id?=${structure_id}`);
};
