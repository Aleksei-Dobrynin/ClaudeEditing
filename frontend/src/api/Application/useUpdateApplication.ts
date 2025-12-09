import http from "api/https";
import { Application } from "../../constants/Application";

export const updateApplication = (data: Application): Promise<any> => {
  return http.put(`/Application/Update`, data);
};

export const sendDpOutgoingNumber = (application_id: number, dp_outgoing_number: string): Promise<any> => {
  return http.put(`/Application/sendDpOutgoingNumber?application_id=${application_id}&dp_outgoing_number=${dp_outgoing_number}`, null);
};

export const approveApplication = (data: any): Promise<any> => {
  return http.post(`/Application/Approve`, data);
};

export const rejectApplication = (data: any): Promise<any> => {
  return http.post(`/Application/Reject`, data);
};
