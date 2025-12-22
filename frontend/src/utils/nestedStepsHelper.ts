// ============================================
// ШАГ 3: Создать утилиту группировки
// ============================================
// НОВЫЙ ФАЙЛ: src/utils/nestedStepsHelper.ts

import { AppStep, NestedStepGroup, GroupedSteps } from 'features/application_task/task/Documents/store';
// src/utils/nestedStepsHelper.ts


/**
 * Группирует шаги по вложенным услугам
 * Возвращает обычные шаги и карту групп по ID родительского шага
 */
export const groupStepsByNested = (steps: AppStep[]): GroupedSteps => {
  if (!steps || steps.length === 0) {
    return {
      regularSteps: [],
      groupsByParentId: new Map()
    };
  }

  // Сортируем по order_number
  const sortedSteps = [...steps].sort((a, b) => a.order_number - b.order_number);

  // Разделяем на обычные и динамически добавленные
  const regularSteps = sortedSteps.filter(s => !s.is_dynamically_added);
  const nestedSteps = sortedSteps.filter(s => s.is_dynamically_added);

  // Группируем вложенные шаги по added_by_link_id
  const groupsMap = new Map<number, AppStep[]>();
  nestedSteps.forEach(step => {
    const linkId = step.added_by_link_id;
    if (linkId) {
      if (!groupsMap.has(linkId)) {
        groupsMap.set(linkId, []);
      }
      groupsMap.get(linkId)!.push(step);
    }
  });

  // Создаем объекты групп и определяем их родительские шаги
  const groups: NestedStepGroup[] = Array.from(groupsMap.entries()).map(([linkId, groupSteps]) => {
    const firstStep = groupSteps[0];
    
    // Определяем родительский шаг (последний обычный шаг перед группой)
    const minOrderNumber = Math.min(...groupSteps.map(s => s.order_number));
    const parentStep = regularSteps
      .filter(s => s.order_number < minOrderNumber)
      .sort((a, b) => b.order_number - a.order_number)[0];

    return {
      linkId,
      serviceName: firstStep.additional_service_name || 'Дополнительная услуга',
      status: determineGroupStatus(groupSteps),
      steps: groupSteps.sort((a, b) => a.order_number - b.order_number),
      parentStepId: parentStep?.id || 0
    };
  });

  // Группируем по родительским шагам
  const groupsByParentId = new Map<number, NestedStepGroup[]>();
  groups.forEach(group => {
    if (!groupsByParentId.has(group.parentStepId)) {
      groupsByParentId.set(group.parentStepId, []);
    }
    groupsByParentId.get(group.parentStepId)!.push(group);
  });

  return {
    regularSteps,
    groupsByParentId
  };
};

/**
 * Определяет статус группы по статусам её шагов
 */
const determineGroupStatus = (steps: AppStep[]): NestedStepGroup['status'] => {
  const allCompleted = steps.every(s => s.status === 'completed');
  const hasInProgress = steps.some(s => s.status === 'in_progress');
  const anyCancelled = steps.some(s => s.status === 'cancelled');

  if (anyCancelled) return 'cancelled';
  if (allCompleted) return 'completed';
  if (hasInProgress) return 'active';
  return 'pending';
};

/**
 * Получить прогресс группы (количество выполненных шагов)
 */
export const getGroupProgress = (group: NestedStepGroup): { completed: number; total: number } => {
  const completed = group.steps.filter(s => s.status === 'completed').length;
  const total = group.steps.length;
  return { completed, total };
};

/**
 * Форматировать нумерацию вложенного шага
 * Например: для шага 3.2 вернет "3.2"
 */
export const formatNestedStepNumber = (
  parentStepNumber: number,
  stepIndexInGroup: number
): string => {
  return `${parentStepNumber}.${stepIndexInGroup + 1}`;
};