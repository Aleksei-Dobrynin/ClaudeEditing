import http from "api/https";
import { FilterApplication } from "constants/Application";

export const getApplications = (): Promise<any> => {
  return http.get("/Application/GetAll");
};

export const getApplicationsFromCabinet = (): Promise<any> => {
  return http.get("/Application/GetFromCabinet");
};

export const getApplicationsPaginationFromCabinet = (filter: FilterApplication): Promise<any> => {
  return http.post("/Application/GetByFilterFromCabinet", filter);
};

export const getApplicationPagination = (filter: FilterApplication): Promise<any> => {
  return http.post(`/Application/GetPaginated`, filter);
};
export const getApplicationPaginationFinPlan = (filter: FilterApplication): Promise<any> => {
  return http.post(`/Application/GetPaginatedFinPlan`, filter);
};

export const getCountApplicationsFromCabinet = (): Promise<any> => {
  return http.get(`/Application/GetCountAppsFromCabinet`);
};

export const getApplicationReport = (isOrg: boolean, mount: number | null, year: number | null, structure: number | null): Promise<any> => {
  const params: { [key: string]: any | undefined } = {};

  if (isOrg !== null) params.isOrg = isOrg;
  if (mount !== null && mount != 0) params.mount = mount;
  if (year !== null) params.year = year;
  if (structure !== null && structure != 0) params.structure = structure;


  return http.get("/Application/GetForReport", {}, { params });
};

export const getApplicationReportPaginated = (isOrg: boolean, mount: number | null, year: number | null, structure: number | null, pageSize: number | null, pageNumber: number | null, orderBy: string | null, orderType: string | null): Promise<any> => {
  const params: { [key: string]: any | undefined } = {};

  if (isOrg !== null) params.isOrg = isOrg;
  if (mount !== null && mount != 0) params.mount = mount;
  if (year !== null) params.year = year;
  if (structure !== null && structure != 0) params.structure = structure;
  if (pageSize !== null && pageSize != 0) {
    params.pageSize = pageSize;
  } else {
    params.pageSize = 10
  }
  if (pageNumber !== null && pageNumber != 0) {
    params.pageNumber = pageNumber
  } else {
    params.pageNumber = 0
  }
  if (orderBy !== null) {
    params.orderBy = orderBy;
  } else {
    params.orderBy = "id"
  }
  if (orderType !== null) {
    params.orderType = orderType;
  } else {
    params.orderType = "ASC"
  }



  return http.get("/Application/GetForReportPaginated", {}, { params });
};

export const getMyApplications = (searchField: string, orderBy: string, orderType: string,
  skipItem: number, getCountItems: number, codeFilter?: string): Promise<any> => {
  return http.get(`/Application/GetMyApplications?searchField=${searchField}&orderBy=${orderBy}
                                                  &orderType=${orderType}&skipItem=${skipItem}
                                                  &getCountItems=${getCountItems}&codeFilter=${codeFilter}`);
};

export const getApplicationForReestrOtchet = (year: number, month: number, status: string, structure_id: number): Promise<any> => {
  return http.get(`/Application/GetForReestrOtchet?year=${year}&month=${month}&status=${status}&structure_id=${structure_id}`);
};

export const getApplicationForReestrRealization = (filter: FilterReestr): Promise<any> => {
  return http.post(`/Application/GetForReestrRealization`, filter);
};


export const getTaxReport = (year: number, month: number, status: string): Promise<any> => {
  return http.get(`/application_in_reestr/GetTaxReport?year=${year}&month=${month}&status=${status}`);
};

export type FilterReestr = {
  year: number;
  month: number;
  status: string;
  structure_ids: any[];
};
