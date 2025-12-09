import http from "api/https";

export const getAllSignByUser = (): Promise<any> => {
  return http.get("/File/GetAllSignByUser");
};

export const getSignEmployeeListByFile = (id: number): Promise<any> => {
  return http.get("/File/GetSignEmployeeListByFile?id=" + id);
};