/**
 * Типы для работы с дополнительными услугами
 */

/**
 * Основной тип дополнительной услуги
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
 * Информация о динамическом шаге
 */
export interface DynamicStepInfo {
  isDynamic: boolean;
  serviceName?: string;
  servicePathName?: string;
  addReason?: string;
  linkId?: number;
  canCancel?: boolean;
}

/**
 * Данные для service_path (используется в диалоге выбора)
 */
export interface ServicePathOption {
  id: number;
  name: string;
  service_name: string;
  service_id?: number;
  steps_count?: number;
  description?: string;
}

/**
 * Статусы дополнительных услуг
 */
export type AdditionalServiceStatus = 'pending' | 'active' | 'completed' | 'cancelled';

/**
 * Константы статусов с описанием
 */
export const ADDITIONAL_SERVICE_STATUS = {
  PENDING: { value: 'pending', label: 'Ожидает', color: 'default' },
  ACTIVE: { value: 'active', label: 'Активна', color: 'primary' },
  COMPLETED: { value: 'completed', label: 'Завершена', color: 'success' },
  CANCELLED: { value: 'cancelled', label: 'Отменена', color: 'error' },
} as const;