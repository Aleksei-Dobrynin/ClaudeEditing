import http from "api/https";

export const getnotificationLog = (id: number): Promise<any> => {
  return http.get(`/notification_log/${id}`);
};

export const getnotificationLogs = (): Promise<any> => {
  return http.get("/notification_log/GetAll");
};

export const getUnsendNotificationLogs = (): Promise<any> => {
  return http.get("/notification_log/GetUnsended");
};

export const getNotificationLogsBySearch = (search: string, showOnlyFailed: boolean, pageNumber: number, pageSize: number): Promise<any> => {
  const params = new URLSearchParams({
    search,
    showOnlyFailed: showOnlyFailed.toString(),
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
  });
  return http.get(`/notification_log/GetAppLogBySearch?${params}`);
};

export const getnotificationLogsByApplicationId = (id: number): Promise<any> => {
  return http.get(`/notification_log/GetByApplicationId?id=${id}`);
};