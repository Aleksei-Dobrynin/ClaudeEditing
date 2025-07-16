import http from "api/https";

export const getDutyPlanLogs = (): Promise<any> => {
  return http.get("/DutyPlanLog/GetAll");
};

export const getDutyPlanLogsByFilter = (filter: any): Promise<any> => {
  return http.post("/DutyPlanLog/GetByFilter", filter);
};

export const changeDutyPlanLogStatus = (archive_log_id: number, status_id: number): Promise<any> => {
  return http.post(`/DutyPlanLog/ChangeStatus`, {
    archive_log_id,
    status_id,
  });
};

export const changeDutyPlanLogGroupStatus = (archive_log_id: number, status_id: number): Promise<any> => {
  return http.post(`/DutyPlanLog/ChangeStatusGroup`, {
    archive_log_id,
    status_id,
  });
};