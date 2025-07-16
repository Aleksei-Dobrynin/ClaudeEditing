import http from "../https";

export const getDarek = (propcode: string): Promise<any> => {
  return http.get(`/Map/SearchAddressesByProp?propcode=${propcode}`);
};

export const getSearchDarek = (propcode: string): Promise<any> => {
  return http.get(`/Map/SearchPropCodes?propcode=${propcode}`);
};
