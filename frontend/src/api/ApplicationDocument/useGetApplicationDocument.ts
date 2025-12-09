import http from "api/https";

export const getApplicationDocument = (id: number): Promise<any> => {
  return http.get(`/ApplicationDocument/GetOneById?id=${id}`);
};

export const getUnsignedDocuments = (search: string, isDeadline: boolean): Promise<any> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  params.append('isDeadline', String(isDeadline));

  return http.get(`/application_step/GetUnsignedDocuments?${params.toString()}`);
};