import http from "api/https";

export const getArchiveLogs = (): Promise<any> => {
  return http.get("/ArchiveLog/GetAll");
};

export const getArchiveLogsByFilter = (filter: any): Promise<any> => {
  return http.post("/ArchiveLog/GetByFilter", filter);
};

export const changeArchiveLogStatus = (archive_log_id: number, status_id: number): Promise<any> => {
  return http.post(`/ArchiveLog/ChangeStatus`, {
    archive_log_id,
    status_id,
  });
};

export const changeArchiveLogGroupStatus = (archive_log_id: number, status_id: number): Promise<any> => {
  return http.post(`/ArchiveLog/ChangeStatusGroup`, {
    archive_log_id,
    status_id,
  });
};