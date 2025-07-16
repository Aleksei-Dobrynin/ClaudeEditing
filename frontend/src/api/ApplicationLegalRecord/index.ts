import http from "api/https";

export const getApplicationLegalRecords = (): Promise<any> => {
  return http.get("/ApplicationLegalRecord/GetAll");
};

export const getApplicationLegalRecord = (id: number): Promise<any> => {
  return http.get(`/ApplicationLegalRecord/GetOneById?id=${id}`);
};

export const deleteApplicationLegalRecord = (id: number): Promise<any> => {
  return http.remove(`/ApplicationLegalRecord/Delete?id=${id}`, {});
};



