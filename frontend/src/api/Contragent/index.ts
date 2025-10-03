import http from "api/https";

export interface ContragentData {
  id?: number;
  name: string;
  address?: string;
  contacts?: string;
  user_id?: string;
  date_start?: Date | string;
  date_end?: Date | string;
  code?: string;
}

// Получить все контрагенты
export const getContragents = (): Promise<any> => {
  return http.get("/contragent/GetAll");
};

// Получить контрагенты с пагинацией
export const getContragentsPaginated = (pageSize: number, pageNumber: number): Promise<any> => {
  return http.get(`/contragent/GetPaginated?pageSize=${pageSize}&pageNumber=${pageNumber}`);
};

// Получить контрагента по ID
export const getContragent = (id: number): Promise<any> => {
  return http.get(`/contragent/${id}`);
};

// Получить контрагента по коду
export const getContragentByCode = (code: string): Promise<any> => {
  return http.get(`/contragent/GetByCode/${code}`);
};

// Создать нового контрагента
export const createContragent = (data: ContragentData): Promise<any> => {
  return http.post("/contragent", data);
};

// Обновить контрагента
export const updateContragent = (data: ContragentData): Promise<any> => {
  return http.put(`/contragent/${data.id}`, data);
};

// Удалить контрагента
export const deleteContragent = (id: number): Promise<any> => {
  return http.remove(`/contragent/${id}`,{});
};