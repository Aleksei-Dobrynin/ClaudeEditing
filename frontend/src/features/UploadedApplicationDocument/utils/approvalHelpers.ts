// Путь: frontend/src/features/UploadedApplicationDocument/utils/approvalHelpers.ts

/**
 * Назначенный исполнитель для подписания
 */
export interface AssignedApprover {
  employee_id: number;
  employee_name: string;
  employee_fullname: string;
  structure_employee_id: number;
  post_name: string;
  structure_name: string;
  post_code?: string;
  structure_code?: string | null;
}

/**
 * Тип для подписанта документа (на основе Backend модели)
 */
export interface DocumentApproval {
  id: number;
  app_document_id?: number | null;
  file_sign_id?: number | null;
  department_id?: number | null;
  department_name?: string | null;
  position_id?: number | null;
  position_name?: string | null;
  status?: string | null; // "signed", "waiting", "rejected", "has_comments"
  approval_date?: string | null;
  comments?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  created_by?: number | null;
  updated_by?: number | null;
  signInfo?: {
    id?: number;
    employee_fullname?: string;
    employee_id?: number;
    [key: string]: any;
  } | null;
  app_step_id?: number | null;
  document_type_id?: number | null;
  is_required?: boolean | null;
  is_required_doc?: boolean | null;
  is_required_approver?: boolean | null;
  document_name?: string | null;
  is_final?: boolean | null;
  source_approver_id?: number | null;
  is_manually_modified?: boolean;
  last_sync_at?: string | null;
  order_number?: number | null;
  
  /**
   * Список назначенных исполнителей для этого подписания
   */
  assigned_approvers?: AssignedApprover[];
  
  // Дополнительные поля для комментариев и отмен
  approval_comments?: Array<{
    id: number;
    comment: string;
    comment_type?: string;
    employee_fullname?: string;
    department_name?: string;
    position_name?: string;
    addressed_to_fullname?: string;
    status?: string;
    created_at?: string;
  }>;
  
  cancellation_history?: Array<{
    id: number;
    original_employee_fullname?: string;
    original_approval_date?: string;
    cancelled_by_fullname?: string;
    cancellation_reason?: string;
    cancelled_at?: string;
  }>;
}

/**
 * Группа подписантов с одинаковым order_number
 */
export interface ApprovalGroup {
  /** Номер порядка подписания */
  order_number: number;
  
  /** Массив подписантов в группе, отсортированных по алфавиту */
  approvals: DocumentApproval[];
  
  /** Отображаемый номер (прямая нумерация по возрастанию) */
  displayNumber: number;
}

/**
 * Группирует подписантов по order_number и сортирует их
 * Сортировка по возрастанию (меньший номер выше)
 * 
 * @param approvals - Массив подписантов
 * @returns Массив групп, отсортированных по order_number (по возрастанию: 1, 2, 3...)
 */
export function groupApprovalsByOrder(
  approvals: DocumentApproval[] | null | undefined
): ApprovalGroup[] {
  // Обработка пустых данных
  if (!approvals || approvals.length === 0) {
    return [];
  }
  
  // Группируем по order_number
  const groupMap = new Map<number, DocumentApproval[]>();
  
  approvals.forEach(approval => {
    // Если order_number null или undefined, используем 1 (первая очередь)
    const orderNum = approval.order_number ?? 1;
    
    if (!groupMap.has(orderNum)) {
      groupMap.set(orderNum, []);
    }
    
    groupMap.get(orderNum)!.push(approval);
  });
  
  // Сортируем группы по order_number по ВОЗРАСТАНИЮ
  const sortedGroups = Array.from(groupMap.entries())
    .sort(([orderA], [orderB]) => orderA - orderB); // 1, 2, 3, 4...
  
  // Прямая нумерация для отображения
  return sortedGroups.map(([order_number, groupApprovals], index) => ({
    order_number,
    approvals: sortApprovalsByName(groupApprovals),
    displayNumber: index + 1 // Прямая нумерация: первый = 1, второй = 2, третий = 3
  }));
}

/**
 * Сортирует подписантов внутри группы по алфавиту (по названию отдела)
 * 
 * @param approvals - Массив подписантов для сортировки
 * @returns Отсортированный массив подписантов
 */
function sortApprovalsByName(
  approvals: DocumentApproval[]
): DocumentApproval[] {
  return [...approvals].sort((a, b) => {
    const nameA = a.department_name?.trim() || '';
    const nameB = b.department_name?.trim() || '';
    
    // Сортировка с учетом русского алфавита
    return nameA.localeCompare(nameB, 'ru-RU', { 
      sensitivity: 'base',
      numeric: true 
    });
  });
}

/**
 * Проверяет, все ли подписанты в группе подписали документ
 */
export function isGroupFullySigned(group: ApprovalGroup): boolean {
  return group.approvals.every(approval => approval.status === 'signed');
}

/**
 * Проверяет, есть ли в группе хотя бы один подписавший
 */
export function hasAnySignedInGroup(group: ApprovalGroup): boolean {
  return group.approvals.some(approval => approval.status === 'signed');
}

/**
 * Проверяет, есть ли в группе комментарии
 */
export function hasCommentsInGroup(group: ApprovalGroup): boolean {
  return group.approvals.some(approval => 
    approval.approval_comments && approval.approval_comments.length > 0
  );
}

/**
 * Получает статус группы на основе статусов подписантов
 */
export function getGroupStatus(group: ApprovalGroup): 'signed' | 'partial' | 'waiting' | 'has_comments' {
  const allSigned = isGroupFullySigned(group);
  const anySigned = hasAnySignedInGroup(group);
  const hasComments = hasCommentsInGroup(group);
  
  if (hasComments) return 'has_comments';
  if (allSigned) return 'signed';
  if (anySigned) return 'partial';
  return 'waiting';
}

/**
 * Форматирует дату для отображения
 */
export function formatApprovalDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

// ========== ФУНКЦИИ ДЛЯ РАБОТЫ С ASSIGNED_APPROVERS ==========

/**
 * Проверяет, назначены ли исполнители для подписания
 */
export function hasAssignedApprovers(approval: DocumentApproval): boolean {
  return !!(approval.assigned_approvers && approval.assigned_approvers.length > 0);
}

/**
 * Форматирует полное имя в формат "Фамилия И.О."
 * Пример: "Иванов Иван Иванович" -> "Иванов И.И."
 * 
 * @param fullName - Полное имя сотрудника
 * @returns Форматированное имя с инициалами
 */
export function formatEmployeeName(fullName: string | null | undefined): string {
  if (!fullName) return '';
  
  const parts = fullName.trim().split(/\s+/); // разделяем по пробелам
  
  if (parts.length === 1) {
    return parts[0]; // только фамилия
  }
  
  const lastName = parts[0];
  const initials = parts
    .slice(1)
    .filter(name => name.length > 0)
    .map(name => name.charAt(0).toUpperCase() + '.')
    .join('');
  
  return initials ? `${lastName} ${initials}` : lastName;
}

/**
 * Форматирует список исполнителей в строку с должностями
 * Формат: "Иванов И.И. (должность) / Петров П.П. (должность)"
 * 
 * @param approvers - Массив назначенных исполнителей
 * @param maxDisplay - Максимальное количество отображаемых исполнителей (по умолчанию без ограничений)
 * @returns Строка с именами исполнителей через "/"
 */
export function formatAssignedApprovers(
  approvers: AssignedApprover[] | null | undefined,
  maxDisplay?: number
): string {
  if (!approvers || approvers.length === 0) {
    return 'Не назначен';
  }

  // Сортируем по алфавиту
  const sorted = [...approvers].sort((a, b) => {
    const nameA = a.employee_fullname || a.employee_name || '';
    const nameB = b.employee_fullname || b.employee_name || '';
    return nameA.localeCompare(nameB, 'ru-RU');
  });

  // Форматируем каждого подписанта: "Фамилия И.О. (должность)"
  const formattedNames = sorted.map(approver => {
    const shortName = formatEmployeeName(approver.employee_fullname || approver.employee_name);
    const position = approver.post_name || 'Без должности';
    return `${shortName} (${position})`;
  });

  // Если есть ограничение на количество
  if (maxDisplay && formattedNames.length > maxDisplay) {
    const displayed = formattedNames.slice(0, maxDisplay);
    const remaining = formattedNames.length - maxDisplay;
    return `${displayed.join(' / ')} + ещё ${remaining}`;
  }

  return formattedNames.join(' / ');
}

/**
 * Получает полный список имен исполнителей (для tooltip)
 * 
 * @param approvers - Массив назначенных исполнителей
 * @returns Строка с полными именами через перенос строки
 */
export function getAssignedApproversTooltip(
  approvers: AssignedApprover[] | null | undefined
): string {
  if (!approvers || approvers.length === 0) {
    return 'Исполнители не назначены';
  }
  
  return approvers
    .sort((a, b) => {
      const nameA = a.employee_fullname || a.employee_name || '';
      const nameB = b.employee_fullname || b.employee_name || '';
      return nameA.localeCompare(nameB, 'ru-RU');
    })
    .map(a => {
      const name = a.employee_fullname || a.employee_name;
      const position = a.post_name || 'Должность не указана';
      return `${name} (${position})`;
    })
    .join('\n');
}

/**
 * Получает информацию о должности и отделе исполнителя
 */
export function getApproverPositionInfo(approver: AssignedApprover): string {
  const parts = [];
  
  if (approver.post_name) {
    parts.push(approver.post_name);
  }
  
  if (approver.structure_name) {
    parts.push(approver.structure_name);
  }
  
  return parts.join(', ') || 'Должность не указана';
}