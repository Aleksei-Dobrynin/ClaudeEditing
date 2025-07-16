import http from "api/https";
import { SmProject } from "constants/SmProject";

export const createSmProject = (data: SmProject): Promise<any> => {
  return http.post(`/sm_project`, data);
};

export const deleteSmProject = (id: number): Promise<any> => {
  return http.remove(`/sm_project/${id}`, {});
};

export const getSmProject = (id: number): Promise<any> => {
  return http.get(`/sm_project/${id}`);
};

export const getSmProjects = (): Promise<any> => {
  return http.get("/sm_project/GetAll");
};

export const getSmProjectsPagination = (
  page: number,
  pageSize: number,
  sortBy: string,
  sortType: string,
  searchText: string
): Promise<any> => {
  return http.get(
    `/sm_project/GetPaginated?offset=${page}&limit=${pageSize}&sort_by=${sortBy}&sort_type=${sortType}&search_text=${searchText}`
  );
};

export const updateSmProject = (data: SmProject): Promise<any> => {
  return http.put(`/sm_project/${data.id}`, data);
};
