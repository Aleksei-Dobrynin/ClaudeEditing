import http from "api/https";

export const getInfoByPin = (pin: string): Promise<any> => {
  return http.get(`/Tunduk/minjust/getInfoByPin?pin=${pin}`);
};
