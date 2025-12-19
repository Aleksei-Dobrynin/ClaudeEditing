using Application.Models;
using Application.Repositories;
using Domain.Entities;
using FluentResults;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.UseCases
{
    /// <summary>
    /// Use Case для работы с дополнительными услугами
    /// Реализует функционал динамического добавления шагов из других услуг
    /// </summary>
    public class application_additional_serviceUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public application_additional_serviceUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        /// <summary>
        /// ГЛАВНЫЙ МЕТОД: Добавить шаги из другой услуги в текущую заявку
        /// </summary>
        public async Task<Result<application_additional_service>> AddStepsFromService(
            int applicationId,
            int additionalServicePathId,
            int addedAtStepId,
            int insertAfterStepId,
            string addReason)
        {
            try
            {
                // ============ ШАГ 1: ВАЛИДАЦИЯ ============

                // Проверка 1: Заявка существует
                var application = await unitOfWork.ApplicationRepository.GetOneByID(applicationId);
                if (application == null)
                    return Result.Fail("Заявка не найдена");

                // Проверка 2: Service path существует
                var servicePath = await unitOfWork.service_pathRepository.GetOne(additionalServicePathId);
                if (servicePath == null)
                    return Result.Fail("Service path не найден");

                // Проверка 3: Услуга еще не добавлена
                var existing = await unitOfWork.application_additional_serviceRepository
                    .GetActiveByServicePathId(applicationId, additionalServicePathId);
                if (existing != null)
                    return Result.Fail($"Услуга уже добавлена в эту заявку");

                // Проверка 4: Не превышен лимит (максимум 3)
                var activeCount = await unitOfWork.application_additional_serviceRepository
                    .GetActiveServicesCount(applicationId);
                if (activeCount >= 3)
                    return Result.Fail("Достигнут лимит дополнительных услуг (максимум 3)");

                // Проверка 5: Шаг для вставки существует
                var insertAfterStep = await unitOfWork.application_stepRepository.GetOne(insertAfterStepId);
                if (insertAfterStep == null)
                    return Result.Fail("Шаг для вставки не найден");

                // КРИТИЧЕСКАЯ ПРОВЕРКА: order_number должен существовать
                if (insertAfterStep.order_number == 0)
                    return Result.Fail($"У шага {insertAfterStepId} order_number = 0 или не установлен");

                // ============ ШАГ 2: СОЗДАЕМ ЗАПИСЬ О ДОБАВЛЕНИИ ============

                var currentUserId = await unitOfWork.UserRepository.GetUserID();
                var currentEmployee = await unitOfWork.EmployeeRepository.GetUser();

                var additionalService = new application_additional_service
                {
                    application_id = applicationId,
                    additional_service_path_id = additionalServicePathId,
                    added_at_step_id = addedAtStepId,
                    insert_after_step_order = insertAfterStep.order_number,
                    add_reason = addReason,
                    requested_by = currentEmployee.id,
                    status = "pending",
                    created_by = currentUserId
                };

                var linkId = await unitOfWork.application_additional_serviceRepository.Add(additionalService);
                additionalService.id = linkId;

                // ============ ШАГ 3: ПОЛУЧАЕМ ШАГИ ИЗ SERVICE_PATH ============

                var sourceSteps = await unitOfWork.path_stepRepository.GetByServicePathId(additionalServicePathId);

                if (sourceSteps == null || !sourceSteps.Any())
                {
                    return Result.Fail("В service_path нет шагов");
                }

                // ============ ШАГ 4: СДВИГАЕМ НУМЕРАЦИЮ СУЩЕСТВУЮЩИХ ШАГОВ ============

                var stepsToAdd = sourceSteps.Count;
                await unitOfWork.application_stepRepository.ShiftOrderNumbers(
                    applicationId,
                    insertAfterStep.order_number,
                    stepsToAdd
                );

                // ============ ШАГ 5: СОЗДАЕМ НОВЫЕ APPLICATION_STEP ============

                var addedSteps = new List<application_step>();
                var currentOrderNumber = insertAfterStep.order_number + 1;

                foreach (var sourceStep in sourceSteps.OrderBy(s => s.order_number))
                {
                    // КРИТИЧЕСКАЯ ПРОВЕРКА перед созданием
                    if (currentOrderNumber <= 0)
                    {
                        return Result.Fail($"Недопустимое значение order_number: {currentOrderNumber}");
                    }

                    var newStep = new application_step
                    {
                        application_id = applicationId,
                        step_id = sourceStep.id,
                        status = "waiting", // Правильный начальный статус

                        // КРИТИЧНО: устанавливаем order_number
                        order_number = currentOrderNumber,

                        // Помечаем как динамически добавленный
                        is_dynamically_added = true,
                        additional_service_path_id = additionalServicePathId,
                        original_step_order = sourceStep.order_number,
                        added_by_link_id = linkId,

                        created_by = currentUserId,
                        created_at = DateTime.Now
                    };

                    // ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА перед отправкой в БД
                    if (newStep.order_number == 0)
                    {
                        return Result.Fail($"КРИТИЧЕСКАЯ ОШИБКА: order_number не установлен для шага {sourceStep.id}");
                    }

                    var newStepId = await unitOfWork.application_stepRepository.Add(newStep);
                    newStep.id = newStepId;
                    addedSteps.Add(newStep);
                    currentOrderNumber++;
                }

                // ============ ШАГ 6: КОПИРУЕМ СОГЛАСОВАНИЯ ============

                foreach (var step in addedSteps)
                {
                    // Получаем step_required_document для этого path_step
                    var stepDocs = await unitOfWork.step_required_documentRepository.GetBystep_id(step.step_id.Value);

                    foreach (var stepDoc in stepDocs)
                    {
                        // Получаем approvers для каждого document
                        var approvers = await unitOfWork.document_approverRepository.GetBystep_doc_id(stepDoc.id);

                        foreach (var approver in approvers)
                        {
                            var approval = new document_approval
                            {
                                app_step_id = step.id,
                                document_type_id = stepDoc.document_type_id,
                                department_id = approver.department_id,
                                position_id = approver.position_id,
                                status = "pending",
                                is_required_approver = approver.is_required,
                                is_required_doc = stepDoc.is_required,
                                created_by = currentUserId,
                                created_at = DateTime.Now
                            };

                            await unitOfWork.document_approvalRepository.Add(approval);
                        }
                    }
                }

                // ============ ШАГ 7: ОБНОВЛЯЕМ ССЫЛКИ ============

                additionalService.first_added_step_id = addedSteps.First().id;
                additionalService.last_added_step_id = addedSteps.Last().id;
                additionalService.status = "active";
                additionalService.updated_by = currentUserId;

                await unitOfWork.application_additional_serviceRepository.Update(additionalService);

                // ============ ЗАВЕРШЕНИЕ ============

                unitOfWork.Commit();

                return Result.Ok(additionalService);
            }
            catch (Exception ex)
            {
                // Логируем полную ошибку
                return Result.Fail($"Ошибка при добавлении шагов: {ex.Message}. StackTrace: {ex.StackTrace}");
            }
        }

        /// <summary>
        /// ИСПРАВЛЕНО: Отменить добавленную услугу и удалить её шаги
        /// С ВАЛИДАЦИЕЙ на загруженные и подписанные документы
        /// </summary>
        public async Task<Result> CancelAdditionalService(int additionalServiceId)
        {
            try
            {
                // ============ ШАГ 1: БАЗОВЫЕ ПРОВЕРКИ ============

                var service = await unitOfWork.application_additional_serviceRepository.GetOne(additionalServiceId);

                if (service == null)
                    return Result.Fail("Дополнительная услуга не найдена");

                if (service.status == "completed")
                    return Result.Fail("Невозможно отменить завершенную услугу");

                if (service.status == "cancelled")
                    return Result.Fail("Услуга уже отменена");

                // Проверяем что ни один шаг не начат
                var anyStarted = await unitOfWork.application_stepRepository
                    .AreAnyDynamicStepsStarted(additionalServiceId);

                if (anyStarted)
                    return Result.Fail("Невозможно отменить - работа по шагам уже начата");

                // ============ ШАГ 2: ПОЛУЧАЕМ ШАГИ ДЛЯ ВАЛИДАЦИИ ============

                var steps = await unitOfWork.application_stepRepository
                    .GetDynamicallyAddedSteps(service.application_id.Value, additionalServiceId);

                if (steps == null || !steps.Any())
                {
                    // Если шагов нет, можно сразу отменить
                    await unitOfWork.application_additional_serviceRepository.CancelService(additionalServiceId);
                    unitOfWork.Commit();
                    return Result.Ok();
                }

                var stepIds = steps.Select(s => s.id).ToArray();

                // ============ ШАГ 3: ВАЛИДАЦИЯ - ПРОВЕРЯЕМ ЗАГРУЖЕННЫЕ ДОКУМЕНТЫ ============

                // Проверяем, есть ли загруженные документы для этих шагов
                var uploadedDocs = new List<uploaded_application_document>();
                foreach (var stepId in stepIds)
                {
                    var docs = await unitOfWork.uploaded_application_documentRepository
                        .ByApplicationIdAndStepId(service.application_id.Value, stepId);

                    if (docs != null && docs.Any())
                    {
                        uploadedDocs.AddRange(docs);
                    }
                }

                if (uploadedDocs.Any())
                {
                    return Result.Fail($"Невозможно удалить дополнительную услугу: найдено {uploadedDocs.Count} загруженных документов. Необходимо сначала удалить все документы.");
                }

                // ============ ШАГ 4: ВАЛИДАЦИЯ - ПРОВЕРЯЕМ ПОДПИСИ ============

                // Получаем все согласования для этих шагов
                var approvals = await unitOfWork.document_approvalRepository.GetByAppStepIds(stepIds);

                // Проверяем наличие подписей (status = "signed" или file_sign_id != null)
                var signedApprovals = approvals
                    .Where(a => a.status == "signed" || a.file_sign_id != null)
                    .ToList();

                if (signedApprovals.Any())
                {
                    var signedCount = signedApprovals.Count;
                    var departmentNames = signedApprovals
                        .Select(a => a.department_name)
                        .Distinct()
                        .Take(3);

                    var deptList = string.Join(", ", departmentNames);

                    return Result.Fail($"Невозможно удалить дополнительную услугу: найдено {signedCount} подписанных согласований от подразделений: {deptList}");
                }

                // ============ ШАГ 5: ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ - УДАЛЯЕМ ============

                // Удаляем согласования для каждого шага
                // Используем GetByAppStepIds для эффективного получения всех согласований
                var allApprovals = await unitOfWork.document_approvalRepository.GetByAppStepIds(stepIds);

                foreach (var approval in allApprovals)
                {
                    await unitOfWork.document_approvalRepository.Delete(approval.id);
                }

                // Удаляем сами шаги
                await unitOfWork.application_stepRepository.DeleteDynamicSteps(additionalServiceId);

                // ============ ШАГ 6: ВОССТАНАВЛИВАЕМ НУМЕРАЦИЮ ============

                await unitOfWork.application_stepRepository.ReorderSteps(service.application_id.Value);

                // ============ ШАГ 7: ОТМЕЧАЕМ КАК CANCELLED ============

                await unitOfWork.application_additional_serviceRepository.CancelService(additionalServiceId);

                unitOfWork.Commit();

                return Result.Ok();
            }
            catch (Exception ex)
            {
                return Result.Fail($"Ошибка при отмене услуги: {ex.Message}. StackTrace: {ex.StackTrace}");
            }
        }

        /// <summary>
        /// Получить список всех дополнительных услуг в заявке
        /// </summary>
        public async Task<List<application_additional_service>> GetByApplicationId(int applicationId)
        {
            return await unitOfWork.application_additional_serviceRepository.GetByApplicationId(applicationId);
        }

        /// <summary>
        /// Получить одну дополнительную услугу по ID
        /// </summary>
        public async Task<application_additional_service> GetOne(int id)
        {
            return await unitOfWork.application_additional_serviceRepository.GetOne(id);
        }

        /// <summary>
        /// Проверить и завершить дополнительную услугу если все шаги выполнены
        /// </summary>
        public async Task CheckAndCompleteIfFinished(int completedStepId)
        {
            var step = await unitOfWork.application_stepRepository.GetOne(completedStepId);

            // Проверяем что это динамический шаг
            if (step.is_dynamically_added != true || !step.added_by_link_id.HasValue)
                return;

            // Проверяем все ли шаги этой услуги завершены
            var allCompleted = await unitOfWork.application_stepRepository
                .AreAllDynamicStepsCompleted(step.added_by_link_id.Value);

            if (allCompleted)
            {
                // Завершаем дополнительную услугу
                await unitOfWork.application_additional_serviceRepository
                    .CompleteService(step.added_by_link_id.Value);

                unitOfWork.Commit();
            }
        }
    }
}