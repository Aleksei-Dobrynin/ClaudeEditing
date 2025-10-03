import http from "api/https";
import { Application } from "../../constants/Application";
import { signFile } from "../FileSign";

export const createApplication = (data: Application): Promise<any> => {
  return http.post(`/Application/Create`, data);
};

export const changeApplicationStatus = (
  application_id: number,
  status_id: number
): Promise<any> => {
  return http.post(`/Application/ChangeStatus`, {
    application_id,
    status_id,
  });
};