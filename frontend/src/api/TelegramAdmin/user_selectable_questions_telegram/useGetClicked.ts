import http from "api/https";

export const GetClicked = (startDate?: string, endDate?: string): Promise<any> => {

  if (startDate != null && endDate == null) {
    console.log("со старт дате")
    return http.get(`/user_selectable_questions_telegram/GetClicked?startDate=${startDate}`);
  }
  if (startDate && endDate) {
    console.log("без старт дате")
    return http.get(`/user_selectable_questions_telegram/GetClicked?startDate=${startDate}&endDate=${endDate}`);
  }
  console.log("без дат")
  return http.get(`/user_selectable_questions_telegram/GetClicked`);
};