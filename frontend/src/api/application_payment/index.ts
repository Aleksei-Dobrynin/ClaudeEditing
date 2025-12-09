import http from "api/https";
import { application_payment, application_payment_sum_request} from "constants/application_payment";

export const createapplication_payment = (data: application_payment, fileName?: string, file?: any): Promise<any> => {
  const formData = new FormData();
  for (var key in data) {
    if (data[key] == null) continue;
    if (typeof data[key] == "number" || typeof (data[key] - 0) == "number"){
      formData.append(key, data[key].toString().replace(",","."));
    } else{
      formData.append(key, data[key]);
    }
  }
  formData.append("document.name", fileName);
  formData.append("document.file", file);
  return http.post(`/application_payment`, formData);
};

export const getTemplate = (data: application_payment): Promise<any> => {
  const formData = new FormData();
  for (var key in data) {
    if (data[key] == null) continue;
    if (typeof data[key] == "number" || typeof (data[key] - 0) == "number"){
      formData.append(key, data[key].toString().replace(",","."));
    } else{
      formData.append(key, data[key]);
    }
  }
  return http.post(`/application_payment/ApplicationTemplate`, formData);
};

export const deleteapplication_payment = (id: number, reason?: string): Promise<any> => {
  return http.remove(`/application_payment/${id}`, {
      id,
      reason
  });
};

export const getapplication_payment = (id: number): Promise<any> => {
  return http.get(`/application_payment/${id}`);
};

export const getapplication_payments = (): Promise<any> => {
  return http.get("/application_payment/GetAll");
};

export const updateapplication_payment = (data: application_payment, fileName?: string, file?: any): Promise<any> => {
  const formData = new FormData();
  for (var key in data) {
    if (data[key] == null) continue;
    if (typeof data[key] == "number" || typeof (data[key] - 0) == "number"){
      formData.append(key, data[key].toString().replace(",","."));
    } else{
      formData.append(key, data[key]);
    }
  }

  for (var key in data) {
    if (data[key] == null) continue;
    if (typeof data[key] == "number"){
      formData.append(key, data[key].toString().replace(",","."));
    } else{
      formData.append(key, data[key]);
    }
  }
  formData.append("document.name", fileName);
  formData.append("document.file", file);
  return http.put(`/application_payment/${data.id}`, formData);
};


export const getapplication_paymentsByapplication_id = (application_id: number): Promise<any> => {
  return http.get(`/application_payment/GetByapplication_id?application_id=${application_id}`);
};

export const getApplicationSumByApplication_id = (application_id: number): Promise<any> => {
  return http.get(`/application_payment/GetApplicationSumByID?id=${application_id}`);
};

export const getapplication_paymentsPrintDocument = (application_id: number): Promise<any> => {
  return http.get(`/application_payment/GetPrintDocument?application_id=${application_id}`);
};

export const getapplication_paymentsPDFDocument = (application_id: number): Promise<any> => {
  return http.get(`/application_payment/GetPDFDocument?application_id=${application_id}`);
};

export const getapplication_paymentssum = (data: application_payment_sum_request): Promise<any> => {
  return http.post(`/application_payment/GetPaginatedByParam`,data);
};

export const saveApplicationTotalSum = (data: any): Promise<any> => {
  return http.post(`/application_payment/SaveApplicationTotalSum`, data);
};