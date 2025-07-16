import http from "api/https";

export const downloadFile = (id: number): Promise<any> => {
  return http.get(`/file/DownloadDocument?id=${id}`, {}, );
};

export const getSignByFileId = (fileId: number): Promise<any> => {
  return http.get(`/file/GetSignByFileId?id=${fileId}`);
};
