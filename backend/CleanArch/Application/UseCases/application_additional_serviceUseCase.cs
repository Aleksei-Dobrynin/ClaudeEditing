using Application.Models;
using Application.Repositories;
using Domain.Entities;
using FluentResults;

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
        /// 
        /// ЧТО ДЕЛАЕТ:
        /// 1. Проверяет можно ли добавить (валидация)
        /// 2. Получает шаги из service_path-источника
        /// 3. Сдвигает нумерацию существующих шагов
        /// 4. Создает новые application_step
        /// 5. Копирует согласования для новых шагов
        /// 6. Сохраняет информацию о добавлении
        /// 
        /// КОГДА ВЫЗЫВАЕТСЯ: Пользователь нажал "Добавить шаги из другой услуги"
        /// 
        /// ПАРАМЕТРЫ:
        ///   - applicationId: ID заявки, в которую добавляем шаги
        ///   - additionalServicePathId: ID service_path, откуда берем шаги
        ///   - addedAtStepId: ID шага, на котором поняли что нужны доп. работы
        ///   - insertAfterStepId: ID шага, после которого вставить новые шаги
        ///   - addReason: Обоснование зачем добавляем
        /// 
        /// ВОЗВРАТ: Result с созданной записью application_additional_service или ошибкой
        /// </summary>
        public async Task<Result<application_additional_service>> AddStepsFromService(
            int applicationId,
            int additionalServicePathId,
            int addedAtStepId,
            int insertAfterStepId,
            string addReason)
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

            if (!insertAfterStep.order_number.HasValue)
                return Result.Fail("У шага отсутствует order_number");

            // ============ ШАГ 2: СОЗДАЕМ ЗАПИСЬ О ДОБАВЛЕНИИ ============

            var currentUserId = await unitOfWork.UserRepository.GetUserID();
            var currentEmployee = await unitOfWork.EmployeeRepository.GetUser();

            var additionalService = new application_additional_service
            {
                application_id = applicationId,
                additional_service_path_id = additionalServicePathId,
                added_at_step_id = addedAtStepId,
                insert_after_step_order = insertAfterStep.order_number.Value,
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
                insertAfterStep.order_number.Value,
                stepsToAdd
            );

            // ============ ШАГ 5: СОЗДАЕМ НОВЫЕ APPLICATION_STEP ============

            var addedSteps = new List<application_step>();
            var currentOrderNumber = insertAfterStep.order_number.Value + 1;

            foreach (var sourceStep in sourceSteps.OrderBy(s => s.order_number))
            {
                var newStep = new application_step
                {
                    application_id = applicationId,
                    step_id = sourceStep.id,
                    status = "pending",
                    order_number = currentOrderNumber,

                    // Помечаем как динамически добавленный
                    is_dynamically_added = true,
                    additional_service_path_id = additionalServicePathId,
                    original_step_order = sourceStep.order_number,
                    added_by_link_id = linkId,

                    created_by = currentUserId,
                    created_at = DateTime.Now
                };

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

        /// <summary>
        /// Отменить добавленную услугу и удалить её шаги
        /// 
        /// ЧТО ДЕЛАЕТ:
        /// 1. Проверяет что услугу можно отменить (шаги не начаты)
        /// 2. Удаляет добавленные application_step
        /// 3. Удаляет связанные document_approval
        /// 4. Восстанавливает нумерацию шагов
        /// 5. Меняет статус на 'cancelled'
        /// 
        /// КОГДА ВЫЗЫВАЕТСЯ: Пользователь нажал "Отменить дополнительную услугу"
        /// ОГРАНИЧЕНИЕ: Можно отменить только если ни один шаг не начат (все в pending)
        /// 
        /// ПАРАМЕТРЫ:
        ///   - additionalServiceId: ID записи в application_additional_service
        /// 
        /// ВОЗВРАТ: Result с успехом или ошибкой
        /// </summary>
        public async Task<Result> CancelAdditionalService(int additionalServiceId)
        {
            // ============ ШАГ 1: ПРОВЕРКИ ============

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

            // ============ ШАГ 2: УДАЛЯЕМ ШАГИ ============

            var steps = await unitOfWork.application_stepRepository
                .GetDynamicallyAddedSteps(service.application_id.Value, additionalServiceId);

            // Удаляем согласования для каждого шага
            foreach (var step in steps)
            {
                var approvals = await unitOfWork.document_approvalRepository.GetByapp_step_id(step.id);

                foreach (var approval in approvals)
                {
                    await unitOfWork.document_approvalRepository.Delete(approval.id);
                }
            }

            // Удаляем сами шаги
            await unitOfWork.application_stepRepository.DeleteDynamicSteps(additionalServiceId);

            // ============ ШАГ 3: ВОССТАНАВЛИВАЕМ НУМЕРАЦИЮ ============

            await unitOfWork.application_stepRepository.ReorderSteps(service.application_id.Value);

            // ============ ШАГ 4: ОТМЕЧАЕМ КАК CANCELLED ============

            await unitOfWork.application_additional_serviceRepository.CancelService(additionalServiceId);

            unitOfWork.Commit();

            return Result.Ok();
        }

        /// <summary>
        /// Получить список всех дополнительных услуг в заявке
        /// 
        /// ЧТО ДЕЛАЕТ:
        /// Возвращает список со статистикой по каждой услуге
        /// 
        /// КОГДА ВЫЗЫВАЕТСЯ: Для отображения в интерфейсе заявки
        /// 
        /// ПАРАМЕТРЫ:
        ///   - applicationId: ID заявки
        /// 
        /// ВОЗВРАТ: Список дополнительных услуг
        /// </summary>
        public async Task<List<application_additional_service>> GetByApplicationId(int applicationId)
        {
            return await unitOfWork.application_additional_serviceRepository.GetByApplicationId(applicationId);
        }

        /// <summary>
        /// Получить одну дополнительную услугу по ID
        /// 
        /// ПАРАМЕТРЫ:
        ///   - id: ID записи в application_additional_service
        /// 
        /// ВОЗВРАТ: Объект application_additional_service или null
        /// </summary>
        public async Task<application_additional_service> GetOne(int id)
        {
            return await unitOfWork.application_additional_serviceRepository.GetOne(id);
        }

        /// <summary>
        /// Проверить и завершить дополнительную услугу если все шаги выполнены
        /// 
        /// ЧТО ДЕЛАЕТ:
        /// Вызывается после каждого завершения шага.
        /// Если шаг динамический и это последний незавершенный шаг услуги,
        /// то завершает всю дополнительную услугу.
        /// 
        /// КОГДА ВЫЗЫВАЕТСЯ: После ApplicationStep.CompleteStep()
        /// АВТОМАТИЧЕСКИ: Да, вызывается системой
        /// 
        /// ПАРАМЕТРЫ:
        ///   - completedStepId: ID только что завершенного application_step
        /// 
        /// ЛОГИКА:
        /// 1. Проверяет что это динамический шаг
        /// 2. Проверяет все ли шаги этой услуги завершены
        /// 3. Если да - завершает дополнительную услугу
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