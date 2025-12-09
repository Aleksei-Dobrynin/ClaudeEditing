import http from "api/https";

export const getHistoryTables = (): Promise<any> => {
  return http.get("/HistoryTable/GetAll");
};

export const getHistoryTablesByApplication = (application_id: number, employee_id: number, date_start: string, date_end: string): Promise<any> => {
  return http.get(`/HistoryTable/GetByApplication?application_id=${application_id}&employee_id=${employee_id}&date_start=${date_start}&date_end=${date_end}`);
};

export const getStatusHistoryTablesByApplication = (application_id: number): Promise<any> => {
  return http.get(`/ApplicationStatusHistory/GetByApplication?application_id=${application_id}`);
};