import http from "api/https";
import { API_URL } from "constants/config";
import { Dayjs } from "dayjs";

export const getDashboardGetCountApplciations = (date_start: Dayjs, date_end: Dayjs, structure_id: number): Promise<any> => {
  return http.get(`/service/DashboardGetCountServices?date_start=${date_start}&date_end=${date_end}&structure_id=${structure_id}`);
};

export const getDashboardGetCountApplciationsForMyStructure = (date_start: Dayjs, date_end: Dayjs): Promise<any> => {
  return http.get(`/service/DashboardGetCountServicesForMyStructure?date_start=${date_start}&date_end=${date_end}`);
};

export const getDashboardGetAppsByStatusAndStructure = (date_start: Dayjs, date_end: Dayjs, structure_id: number, status_name: string): Promise<any> => {
  return http.get(`/service/DashboardGetAppsByStatusAndStructure?date_start=${date_start}&date_end=${date_end}&structure_id=${structure_id}&status_name=${status_name}`);
};

export const getDashboardGetFinance = (date_start: Dayjs, date_end: Dayjs, structure_id: number): Promise<any> => {
  return http.get(`/service/DashboardGetFinance?date_start=${date_start}&date_end=${date_end}&structure_id=${structure_id}`);
};

export const getDashboardGetPaymentFinance = (date_start: Dayjs, date_end: Dayjs, structure_id: number): Promise<any> => {
  return http.get(`/service/DashboardGetPaymentFinance?date_start=${date_start}&date_end=${date_end}&structure_id=${structure_id}`);
};

export const getDashboardGetCountTasks = (date_start: Dayjs, date_end: Dayjs, structure_id: number): Promise<any> => {
  return http.get(`/service/DashboardGetCountTasks?date_start=${date_start}&date_end=${date_end}&structure_id=${structure_id}`);
};

export const getDashboardGetCountTasksForMyStructure = (date_start: Dayjs, date_end: Dayjs): Promise<any> => {
  return http.get(`/service/DashboardGetCountTasksForMyStructure?date_start=${date_start}&date_end=${date_end}`);
};

export const getDashboardGetCountUserApplications = (date_start: Dayjs, date_end: Dayjs): Promise<any> => {
  return http.get(`/service/DashboardGetCountUserApplications?date_start=${date_start}&date_end=${date_end}`);
};

export const getDashboardGetCountUserApplicationsMyStructure = (date_start: Dayjs, date_end: Dayjs): Promise<any> => {
  return http.get(`/service/DashboardGetCountUserApplicationsMyStructure?date_start=${date_start}&date_end=${date_end}`);
};

export const getDashboardGetCountObjects = (district_id: number): Promise<any> => {
  return http.get(`/service/DashboardGetCountObjects?district_id=${district_id}`);
};

export const getDashboardGetCountObjectsMyStructure = (district_id: number): Promise<any> => {
  return http.get(`/service/DashboardGetCountObjectsMyStructure?district_id=${district_id}`);
};

export const getApplicationsWithCoords = (date_start: Dayjs, date_end: Dayjs, service_id: number, tag_id: number, status_code: string): Promise<any> => {
  return http.get(`/service/GetApplicationsWithCoords?date_start=${date_start}&date_end=${date_end}&service_id=${service_id}&tag_id=${tag_id}&status_code=${status_code}`);
};

export const getApplicationsWithCoordsByHeadStructure = (date_start: Dayjs, date_end: Dayjs, service_id: number, tag_id: number, status_code: string): Promise<any> => {
  return http.get(`/service/GetApplicationsWithCoordsByHeadStructure?date_start=${date_start}&date_end=${date_end}&service_id=${service_id}&tag_id=${tag_id}&status_code=${status_code}`);
};

export const getDashboardAppCount = (date_start: Dayjs, date_end: Dayjs, service_id: number, status_id: number): Promise<any> => {
  return http.get(`/service/DashboardGetAppCount?date_start=${date_start}&date_end=${date_end}&service_id=${service_id}&status_id=${status_id}`);
};

export const getDashboardAppCountMyStructure = (date_start: Dayjs, date_end: Dayjs, service_id: number, status_id: number): Promise<any> => {
  return http.get(`/service/DashboardGetAppCountMyStructure?date_start=${date_start}&date_end=${date_end}&service_id=${service_id}&status_id=${status_id}`);
};

export const getForFinanceInvoice = (date_start: Dayjs, date_end: Dayjs): Promise<any> => {
  return http.get(`/service/GetForFinanceInvoice?date_start=${date_start}&date_end=${date_end}`);
};

export const getDashboardGetApplicationCountHour = (date_start: Dayjs, date_end: Dayjs): Promise<any> => {
  return http.get(`/service/DashboardGetApplicationCountHour?date_start=${date_start}&date_end=${date_end}`);
};

export const getDashboardGetApplicationCountHourMyStructure = (date_start: Dayjs, date_end: Dayjs): Promise<any> => {
  return http.get(`/service/DashboardGetApplicationCountHourMyStructure?date_start=${date_start}&date_end=${date_end}`);
};

export const getDashboardGetApplicationCountWeek = (date_start: Dayjs, date_end: Dayjs): Promise<any> => {
  return http.get(`/service/DashboardGetApplicationCountWeek?date_start=${date_start}&date_end=${date_end}`);
};

export const getDashboardGetApplicationCountWeekMyStructure = (date_start: Dayjs, date_end: Dayjs): Promise<any> => {
  return http.get(`/service/DashboardGetApplicationCountWeekMyStructure?date_start=${date_start}&date_end=${date_end}`);
};

export const getDashboardGetArchiveCount = (date_start: string, date_end: string): Promise<any> => {
  return http.get(`/service/DashboardGetArchiveCount?date_start=${date_start}&date_end=${date_end}`);
};

export const getDashboardGetArchiveCountMyStructure = (date_start: string, date_end: string): Promise<any> => {
  return http.get(`/service/DashboardGetArchiveCountMyStructure?date_start=${date_start}&date_end=${date_end}`);
};

export const getDashboardIssuedAppsRegister = (date_start: string, date_end: string): Promise<any> => {
  return http.get(`/service/DashboardGetIssuedAppsRegister?date_start=${date_start}&date_end=${date_end}`);
};

export const getDashboardGetCountTaskByStructure = (date_start: string, date_end: string): Promise<any> => {
  return http.get(`/service/DashboardGetCountTaskByStructure?date_start=${date_start}&date_end=${date_end}`);
};

export const getDashboardGetCountBySelectedStructure = (date_start: string, date_end: string, structure_id: number): Promise<any> => {
  return http.get(`/service/DashboardGetCountBySelectedStructure?date_start=${date_start}&date_end=${date_end}&structure_id=${structure_id}`);
};
export const getDashboardGetRefucalCountBySelectedStructure = (date_start: string, date_end: string, structure_id: number): Promise<any> => {
  return http.get(`/service/DashboardGetRefucalCountBySelectedStructure?date_start=${date_start}&date_end=${date_end}&structure_id=${structure_id}`);
};

export const getDashboardGetCountLateBySelectedStructure = (date_start: string, date_end: string, structure_id: number): Promise<any> => {
  return http.get(`/service/DashboardGetCountLateBySelectedStructure?date_start=${date_start}&date_end=${date_end}&structure_id=${structure_id}`);
};


export const getDashboardGetCountLateByStructure = (date_start: string, date_end: string): Promise<any> => {
  return http.get(`/service/DashboardGetCountLateByStructure?date_start=${date_start}&date_end=${date_end}`);
};
export const getDashboardGetRefucalCountByStructure = (date_start: string, date_end: string): Promise<any> => {
  return http.get(`/service/DashboardGetRefucalCountByStructure?date_start=${date_start}&date_end=${date_end}`);
};
export const getDashboardGetAppsFromRegister = (date_start: string, date_end: string): Promise<any> => {
  return http.get(`/service/DashboardGetAppsFromRegister?date_start=${date_start}&date_end=${date_end}`);
};
export const getDashboardEmployeeToDutyPlan = (date_start: string, date_end: string): Promise<any> => {
  return http.get(`/service/DashboardGetEmployeesToDutyPlan?date_start=${date_start}&date_end=${date_end}`);
};

export const getForPivotDashboard = (date_start: Dayjs, date_end: Dayjs, service_id: number, status_id: number): Promise<any> => {
  return http.get(`/application/GetForPivotDashboard?date_start=${date_start}&date_end=${date_end}&service_id=${service_id}&status_id=${status_id}`);
};

export const getForPivotDashboardMyStructure = (date_start: Dayjs, date_end: Dayjs, service_id: number, status_id: number): Promise<any> => {
  return http.get(`/application/GetForPivotDashboardMyStructure?date_start=${date_start}&date_end=${date_end}&service_id=${service_id}&status_id=${status_id}`);
};
export const getForTaskPivotDashboard = (date_start: Dayjs, date_end: Dayjs, out_of_date: boolean): Promise<any> => {
  return http.get(`/application_task/GetForPivotDashboard?date_start=${date_start}&date_end=${date_end}&out_of_date=` + (out_of_date ? "true": "false"));
};
export const getForTaskPivotDashboardMyStructure = (date_start: Dayjs, date_end: Dayjs, out_of_date: boolean): Promise<any> => {
  return http.get(`/application_task/GetForPivotDashboardMyStructure?date_start=${date_start}&date_end=${date_end}&out_of_date=` + (out_of_date ? "true": "false"));
};
export const getForTaskPivotHeadDashboard = (date_start: Dayjs, date_end: Dayjs, out_of_date: boolean): Promise<any> => {
  return http.get(`/application_task/GetForPivotHeadDashboard?date_start=${date_start}&date_end=${date_end}&out_of_date=` + (out_of_date ? "true": "false"));
};

export const getloadApplicationsCategoryCount = (date_start: Dayjs, date_end: Dayjs, district_id?: number, is_paid?: boolean): Promise<any> => {
  return http.get(`/Service/GetApplicationsCategoryCount?date_start=${date_start}&date_end=${date_end}&district_id=${district_id}&is_paid=${is_paid}`);
};

export const getloadApplicationsCategoryCountForMyStructure = (date_start: Dayjs, date_end: Dayjs, district_id?: number, is_paid?: boolean): Promise<any> => {
  return http.get(`/Service/GetApplicationsCategoryCountForMyStructure?date_start=${date_start}&date_end=${date_end}&district_id=${district_id}&is_paid=${is_paid}`);
};

export const getForArchivePivotDashboard = (date_start: Dayjs, date_end: Dayjs): Promise<any> => {
  return http.get(`/ArchiveLog/GetForPivotDashboard?date_start=${date_start}&date_end=${date_end}`);
};

export const getForArchivePivotDashboardMyStructure = (date_start: Dayjs, date_end: Dayjs): Promise<any> => {
  return http.get(`/ArchiveLog/GetForPivotDashboardMyStructure?date_start=${date_start}&date_end=${date_end}`);
};

export const getAppCountDashboardByStructure = (date_start: string, date_end: string, structure_id: number): Promise<any> => {
  return http.get(`/service/GetAppCountDashboardByStructure?date_start=${date_start}&date_end=${date_end}&structure_id=${structure_id}`); 
};

export const dashboardGetEmployeeCalculations = (structure_id: number, date_start: string, date_end: string, sort: string): Promise<any> => {
  return http.get(`/application_payment/DashboardGetEmployeeCalculations?date_start=${date_start}&date_end=${date_end}&structure_id=${structure_id}&sort=${sort}`); 
};

export const dashboardGetEmployeeCalculationsGrouped = (structure_id: number, date_start: string, date_end: string): Promise<any> => {
  return http.get(`/application_payment/DashboardGetEmployeeCalculationsGrouped?date_start=${date_start}&date_end=${date_end}&structure_id=${structure_id}`); 
};

export const dashboardGetEmployeeCalculationsExcel = (structure_id: number, date_start: string, date_end: string, sort: string): Promise<any> => {
  var url = API_URL + `application_payment/DashboardGetEmployeeCalculationsExcel?date_start=${date_start}&date_end=${date_end}&structure_id=${structure_id}&sort=${sort}`;
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.blob();
  });
};

export const dashboardGetEmployeeCalculationsGroupedExcel = (structure_id: number, date_start: string, date_end: string): Promise<any> => {
  var url = API_URL + `application_payment/DashboardGetEmployeeCalculationsGroupedExcel?date_start=${date_start}&date_end=${date_end}&structure_id=${structure_id}`;
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.blob();
  });
};