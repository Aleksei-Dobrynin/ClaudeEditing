// api/AddressUnit/index.ts
import http from "api/https";

// Получить все адресные единицы
export const getAddressUnits = (): Promise<any> => {
  return http.get("/AddressUnit/GetAll");
};

// Получить адресную единицу по ID
export const getAddressUnit = (id: number): Promise<any> => {
  return http.get(`/AddressUnit/GetOneById?id=${id}`);
};

// Получить адресные единицы с пагинацией
export const getAddressUnitsPagination = (
  pageSize: number,
  pageNumber: number,
  orderBy?: string | null,
  orderType?: string | null
): Promise<any> => {
  let url = `/AddressUnit/GetPaginated?pageSize=${pageSize}&pageNumber=${pageNumber}`;
  
  if (orderBy) {
    url += `&orderBy=${orderBy}`;
  }
  if (orderType) {
    url += `&orderType=${orderType}`;
  }
  
  return http.get(url);
};

// Создать новую адресную единицу
export const createAddressUnit = (data: any): Promise<any> => {
  return http.post(`/AddressUnit/Create`, data);
};

// Обновить адресную единицу
export const updateAddressUnit = (data: any): Promise<any> => {
  return http.put(`/AddressUnit/Update`, data);
};

// Удалить адресную единицу
export const deleteAddressUnit = (id: number): Promise<any> => {
  return http.remove(`/AddressUnit/Delete?id=${id}`, {});
};