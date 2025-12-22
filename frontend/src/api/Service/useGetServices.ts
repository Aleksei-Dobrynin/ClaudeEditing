import http from "api/https";
import {
  mockServicesForAdding,
  mockServiceSteps,
  mockServicesWithSigners
} from "../ApplicationAdditionalService/mocks";

const USE_MOCKS = true;

export const getServices = (): Promise<any> => {
  return http.get("/Service/GetAll");
};

export const getMyStructure = (): Promise<any> => {
  return http.get("/Service/GetMyStructure");
};

/**
 * Получить все активные услуги для добавления
 */
export const getServicesForAdding = (): Promise<any> => {
  // if (USE_MOCKS) {
  //   return Promise.resolve(mockServicesForAdding);
  // }
  return http.get("/Service/GetAllActive");
};

/**
 * Получить шаги услуги по service_id
 */
export const getServiceSteps = (serviceId: number): Promise<any> => {
  // if (USE_MOCKS) {
  //   // Имитация задержки сети
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve(mockServicesWithSigners);
  //     }, 300);
  //   });
  // }
  return http.get(`/service_path/GetServiceWithPathAndSigners?serviceId=${serviceId}`);
};