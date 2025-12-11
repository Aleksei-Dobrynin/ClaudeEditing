import http from "api/https";

export const signFile = (id: number, uplId: number, pin: string, code: string): Promise<any> => {
  return http.get(`/file/SignDocument?id=${id}&uplId=${uplId}&pin=${pin}&code=${code}`, {}, );
};


export const sendCode = (pin: string): Promise<any> => {
  return http.get(`/file/SendCode?pin=${pin}`, {}, );
};