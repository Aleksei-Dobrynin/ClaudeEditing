// api/StreetType/index.ts
import http from "api/https";

// Получить все типы адресных единиц
export const getStreetTypes = (): Promise<any> => {
  return http.get("/StreetType/GetAll");
};

// Получить тип адресной единицы по ID
export const getStreetType = (id: number): Promise<any> => {
  return http.get(`/StreetType/GetOneById?id=${id}`);
};

// Получить типы адресных единиц с пагинацией
export const getStreetTypesPagination = (
  pageSize: number,
  pageNumber: number,
  orderBy?: string | null,
  orderType?: string | null
): Promise<any> => {
  let url = `/StreetType/GetPaginated?pageSize=${pageSize}&pageNumber=${pageNumber}`;
  
  if (orderBy) {
    url += `&orderBy=${orderBy}`;
  }
  if (orderType) {
    url += `&orderType=${orderType}`;
  }
  
  return http.get(url);
};

// Создать новый тип адресной единицы
export const createStreetType = (data: any): Promise<any> => {
  return http.post(`/StreetType/Create`, data);
};

// Обновить тип адресной единицы
export const updateStreetType = (data: any): Promise<any> => {
  return http.put(`/StreetType/Update`, data);
};

// Удалить тип адресной единицы
export const deleteStreetType = (id: number): Promise<any> => {
  return http.remove(`/StreetType/Delete?id=${id}`, {});
};