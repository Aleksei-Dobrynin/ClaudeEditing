import http from "api/https";

/**
 * DTO для добавления шагов из другой услуги
 */
export interface AddStepsFromServiceRequest {
  application_id: number;
  additional_service_path_id: number;
  added_at_step_id: number;
  insert_after_step_id: number;
  add_reason: string;
}

/**
 * DTO для дополнительной услуги
 */
export interface ApplicationAdditionalService {
  id: number;
  application_id: number;
  additional_service_path_id: number;
  added_at_step_id: number;
  insert_after_step_order: number;
  add_reason: string;
  requested_by: number;
  requested_at: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  first_added_step_id?: number;
  last_added_step_id?: number;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
  
  // Joined fields from backend
  service_path_name?: string;
  service_name?: string;
  requested_by_name?: string;
}

/**
 * Добавить шаги из другой услуги в заявку
 */
export const addStepsFromService = (data: AddStepsFromServiceRequest): Promise<any> => {
  return http.post(`/application_additional_service/AddSteps`, data);
};

/**
 * Получить список дополнительных услуг для заявки
 */
export const getAdditionalServicesByApplicationId = (applicationId: number): Promise<any> => {
  return http.get(`/application_additional_service/GetByApplicationId?application_id=${applicationId}`);
};

/**
 * Отменить дополнительную услугу (удалить динамические шаги)
 */
export const cancelAdditionalService = (id: number): Promise<any> => {
  return http.post(`/application_additional_service/Cancel`, { id });
};

/**
 * Получить детальную информацию о дополнительной услуге
 */
export const getAdditionalServiceById = (id: number): Promise<any> => {
  return http.get(`/application_additional_service/${id}`);
};