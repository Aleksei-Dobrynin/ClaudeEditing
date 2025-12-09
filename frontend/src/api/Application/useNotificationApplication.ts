import http from "api/https";

export const sendNotification = (
  textSms: string,
  textTelegram: string,
  smsNumbers: string[],
  telegramNumbers: string[],
  application_id?: number,
  customer_id?: number,
): Promise<any> => {
  return http.post(`/Application/SendNotification`, {
    textSms,
    textTelegram,
    smsNumbers,
    telegramNumbers,
    application_id,
    customer_id
  });
};