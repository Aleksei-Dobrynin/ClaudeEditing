// api/AddressUnitType/index.ts
import http from "api/https";

// Получить все типы адресных единиц
export const getAddressUnitTypes = (): Promise<any> => {
  return http.get("/AddressUnitType/GetAll");
};

// Получить тип адресной единицы по ID
export const getAddressUnitType = (id: number): Promise<any> => {
  return http.get(`/AddressUnitType/GetOneById?id=${id}`);
};

// Получить типы адресных единиц с пагинацией
export const getAddressUnitTypesPagination = (
  pageSize: number,
  pageNumber: number,
  orderBy?: string | null,
  orderType?: string | null
): Promise<any> => {
  let url = `/AddressUnitType/GetPaginated?pageSize=${pageSize}&pageNumber=${pageNumber}`;
  
  if (orderBy) {
    url += `&orderBy=${orderBy}`;
  }
  if (orderType) {
    url += `&orderType=${orderType}`;
  }
  
  return http.get(url);
};

// Создать новый тип адресной единицы
export const createAddressUnitType = (data: any): Promise<any> => {
  return http.post(`/AddressUnitType/Create`, data);
};

// Обновить тип адресной единицы
export const updateAddressUnitType = (data: any): Promise<any> => {
  return http.put(`/AddressUnitType/Update`, data);
};

// Удалить тип адресной единицы
export const deleteAddressUnitType = (id: number): Promise<any> => {
  return http.remove(`/AddressUnitType/Delete?id=${id}`, {});
};