// api/Street/index.ts
import http from "api/https";

// Получить все адресные единицы
export const getStreets = (): Promise<any> => {
  return http.get("/Street/GetAll");
};

// Получить адресную единицу по ID
export const getStreet = (id: number): Promise<any> => {
  return http.get(`/Street/GetOneById?id=${id}`);
};

// Получить адресные единицы с пагинацией
export const getStreetsPagination = (
  pageSize: number,
  pageNumber: number,
  orderBy?: string | null,
  orderType?: string | null
): Promise<any> => {
  let url = `/Street/GetPaginated?pageSize=${pageSize}&pageNumber=${pageNumber}`;
  
  if (orderBy) {
    url += `&orderBy=${orderBy}`;
  }
  if (orderType) {
    url += `&orderType=${orderType}`;
  }
  
  return http.get(url);
};

// Создать новую адресную единицу
export const createStreet = (data: any): Promise<any> => {
  return http.post(`/Street/Create`, data);
};

// Обновить адресную единицу
export const updateStreet = (data: any): Promise<any> => {
  return http.put(`/Street/Update`, data);
};

// Удалить адресную единицу
export const deleteStreet = (id: number): Promise<any> => {
  return http.remove(`/Street/Delete?id=${id}`, {});
};