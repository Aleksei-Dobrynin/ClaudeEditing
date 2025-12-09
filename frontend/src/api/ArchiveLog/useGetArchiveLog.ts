import http from "api/https";

export const getArchiveLog = (id: number): Promise<any> => {
  return http.get(`/ArchiveLog/GetOneById?id=${id}`);
};

export const getGroupByParentID = (id: number): Promise<any> => {
  return http.get(`/ArchiveLog/GetGroupByParentID?id=${id}`);
};
