// Путь: frontend/src/types/SigningRole.ts
// НОВЫЙ ФАЙЛ - создать этот файл

/**
 * Доступная роль для подписания документа
 */
export interface AvailableSigningRole {
  /** ID должности */
  positionId: number;
  
  /** Название должности */
  positionName: string;
  
  /** ID отдела */
  departmentId: number;
  
  /** Название отдела */
  departmentName: string;
  
  /** ID записи в employee_in_structure */
  structureEmployeeId: number;
  
  /** Документ уже подписан этой ролью */
  alreadySigned: boolean;
  
  /** Требуется подпись этой роли для согласования */
  isRequired: boolean;
  
  /** Роль активна (не завершена) */
  isActive: boolean;
  
  /** Дата начала работы в этой роли */
  dateStart: string;
  
  /** Дата окончания работы в этой роли (если есть) */
  dateEnd?: string;
  
  /** ID подписи (если документ уже подписан этой ролью) */
  fileSignId?: number;
}

/**
 * Данные для отзыва подписи
 */
export interface RevokeSignatureData {
  /** ID файла */
  fileId: number;
  
  /** ID подписи для отзыва */
  fileSignId: number;
  
  /** Роль, которая подписала */
  role: AvailableSigningRole;
}