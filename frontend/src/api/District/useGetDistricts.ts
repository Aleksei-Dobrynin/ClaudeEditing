import http from "api/https";

export const getDistricts = (): Promise<any> => {
  return http.get("/District/GetAll");
};

export const getTundukDistricts = (): Promise<any> => {
  return http.get(`/Tunduk/getDistricts`);
};

export const getAteChildren = (id: number): Promise<any> => {
  return http.get(`/Tunduk/GetAteChildren?ateId=` + id);
};

export const getAllStreets = (): Promise<any> => {
  return http.get(`/Tunduk/GetAllStreets`);
};


export const getOneStreet = (id): Promise<any> => {
  return http.get(`/Tunduk/GetOneStreet?id=`+id);
};

export const searchStreet = (text: string, ateId: number): Promise<any> => {
  return http.get(`/Tunduk/Search?text=${encodeURIComponent(text)}&ateId=${ateId}`);
};

export const getAteStreets = (id: number): Promise<any> => {
  return http.get(`/Tunduk/GetAteStreets?ateId=` + id);
};

export const findAddresses = (streetId: number, building: string, apartment: string, uch: string): Promise<any> => {
  return http.get(`/Tunduk/SearchAddress?streetId=${streetId ?? ''}&building=${building ?? ''}&apartment=${apartment ?? ''}&uch=${uch ?? ''}`);
};