import http from "api/https";


export const getByCustomersIdArchiveObject = (id: number): Promise<any> => {
  return http.get(`/customers_for_archive_object/getByCustomersIdArchiveObject?ArchiveObject_id=${id}`);
};

export const getCustomersForArchiveObject = (): Promise<any> => {
  return http.get("/customers_for_archive_object/GetCustomersForArchiveObjects");
};