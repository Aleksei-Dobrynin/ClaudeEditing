import http from "api/https";

export const getArchiveObjectFiles = (): Promise<any> => {
  return http.get("/ArchiveObjectFile/GetAll");
};

export const getArchiveObjectFilesNotInFolder = (): Promise<any> => {
  return http.get("/ArchiveObjectFile/GetNotInFolder");
};

export const getArchiveObjectFilesByArchiveObject = (idArchiveObject: number): Promise<any> => {
  return http.get(`/ArchiveObjectFile/GetByidArchiveObject?idArchiveObject=${idArchiveObject}`);
};

export const getArchiveObjectFilesByArchiveFolder = (idArchiveFolder: number): Promise<any> => {
  return http.get(`/ArchiveObjectFile/GetByidArchiveFolder?idArchiveFolder=${idArchiveFolder}`);
};