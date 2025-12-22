import http from "api/https";
import {
  mockAdditionalServices,
  mockServicesForAdding,
  mockServiceSteps,
  mockAddStepsResponse, mockServicesWithSigners
} from "./mocks";

const USE_MOCKS = true;

/**
 * Добавить шаги из другой услуги в заявку
 */
export const addStepsFromService = (data: {
  application_id: number;
  additional_service_path_id: number;
  added_at_step_id: number;
  insert_after_step_id: number;
  add_reason: string;
}): Promise<any> => {
  return http.post("/application_additional_service/AddSteps", data);
};

/**
 * Получить все дополнительные услуги для заявки
 */
export const getAdditionalServicesByApplicationId = (
  applicationId: number
): Promise<any> => {
  if (USE_MOCKS) {
    return Promise.resolve(mockAdditionalServices);
  }
  return http.get(
    `/ApplicationAdditionalService/GetByApplicationId?applicationId=${applicationId}`
  );
};

/**
 * Отменить дополнительную услугу
 */
export const cancelAdditionalService = (id: number): Promise<any> => {
  return http.post("/ApplicationAdditionalService/Cancel", { id });
};

/**
 * Получить детали дополнительной услуги
 */
export const getAdditionalServiceById = (id: number): Promise<any> => {
  return http.get(`/ApplicationAdditionalService/GetOne?id=${id}`);
};

// Функция для получения услуг (можно использовать в store)
export const getMockServicesWithSigners = (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockServicesWithSigners);
    }, 300); // Симуляция задержки сети
  });
};

// Функция для получения шагов конкретной услуги с подписантами
export const getMockServiceStepsWithSigners = (serviceId: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(mockServicesWithSigners);
    }, 300);
  });
};

export const getapplication_additional_service = (id: number): Promise<any> => {
  return http.get(`/application_additional_service/GetByApplicationId?application_id=${id}`);
};

export const setApplicationAdditionalServiceCancel = (id: number): Promise<any> => {
  return http.post(`/application_additional_service/Cancel`, {
    id
  });
};