// Путь: frontend/src/api/FileSign/index.ts
// ОБНОВИТЬ ФАЙЛ - добавить новые функции к существующим

import http from "api/https";

// ============ СУЩЕСТВУЮЩИЕ ФУНКЦИИ (оставить без изменений) ============
export const signFile = (id: number, uplId: number, pin: string, code: string): Promise<any> => {
  return http.get(`/file/SignDocument?id=${id}&uplId=${uplId}&pin=${pin}&code=${code}`, {});
};

export const callOutSignFile = (id: number): Promise<any> => {
  return http.get(`/file/CallOutSignDocument?id=${id}`, {});
};

export const sendCode = (pin: string): Promise<any> => {
  return http.get(`/file/SendCode?pin=${pin}`, {});
};

// ============ НОВЫЕ ФУНКЦИИ (добавить в конец файла) ============

/**
 * Получить список доступных ролей для подписания документа
 * @param fileId - ID файла
 */
export const getAvailableSigningRoles = (fileId: number): Promise<any> => {
  return http.get(`/file/GetAvailableSigningRoles?fileId=${fileId}`);
};

/**
 * Подписать документ с указанием конкретной роли
 * @param fileId - ID файла
 * @param uplId - ID загруженного документа
 * @param pin - PIN для ЭЦП
 * @param code - Код подтверждения
 * @param positionId - ID должности (опционально)
 * @param departmentId - ID отдела (опционально)
 */
export const signFileWithRole = (
  fileId: number,
  uplId: number,
  pin: string,
  code: string,
  positionId?: number,
  departmentId?: number
): Promise<any> => {
  const params = new URLSearchParams({
    id: fileId.toString(),
    uplId: uplId.toString(),
    pin,
    code,
  });

  if (positionId !== undefined) {
    params.append('positionId', positionId.toString());
  }
  if (departmentId !== undefined) {
    params.append('departmentId', departmentId.toString());
  }

  return http.get(`/file/SignDocument?${params.toString()}`);
};

/**
 * Отозвать конкретную подпись по ID
 * @param fileSignId - ID подписи для отзыва
 */
export const callOutSignFileById = (fileSignId: number): Promise<any> => {
  return http.get(`/file/CallOutSignDocument?id=${fileSignId}`);
};