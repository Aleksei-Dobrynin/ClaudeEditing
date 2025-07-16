using Application.Models;
using Application.Repositories;
using Domain;
using Domain.Entities;
using FluentResults;
using System.Linq;

namespace Application.UseCases
{
    public class application_stepUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IAuthRepository _authRepository;

        public application_stepUseCases(IUnitOfWork unitOfWork, IAuthRepository authRepository)
        {
            this.unitOfWork = unitOfWork;
            this._authRepository = authRepository;
        }

        private async Task LogStatusChange(int appStepId, string oldStatus, string newStatus, string comments = null)
        {
            var userId = await unitOfWork.UserRepository.GetUserID();
            var statusLog = new StepStatusLog
            {
                app_step_id = appStepId,
                old_status = oldStatus,
                new_status = newStatus,
                change_date = DateTime.Now,
                comments = comments,
                created_at = DateTime.Now,
                updated_at = DateTime.Now,
                created_by = userId,
                updated_by = userId
            };
            await unitOfWork.StepStatusLogRepository.Add(statusLog);
        }

        public Task<List<application_step>> GetAll()
        {
            return unitOfWork.application_stepRepository.GetAll();
        }

        public async Task<List<ApplicationUnsignedDocumentsModel>> GetUnsignedDocuments(string search, bool isDeadline)
        {
            var roles = await _authRepository.GetMyRoleIds();
            var user_id = await unitOfWork.UserRepository.GetUserID();

            var orgs = await unitOfWork.EmployeeInStructureRepository.GetInMyStructure(user_id);
            var role_id = roles?.FirstOrDefault() ?? 0;
            var org_id = orgs?.FirstOrDefault()?.structure_id ?? 0;

            var res = await unitOfWork.application_stepRepository.GetUnsignedDocuments(role_id, org_id, search, isDeadline);

            var result = res.GroupBy(x => x.app_id).Select(x => new ApplicationUnsignedDocumentsModel
            {
                app_id = x.Key,
                app_number = x.FirstOrDefault()?.app_number,
                full_name = x.FirstOrDefault()?.full_name,
                service_name = x.FirstOrDefault()?.service_name,
                service_days = x.FirstOrDefault()?.service_days,
                deadline = x.FirstOrDefault()?.deadline,
                pin = x.FirstOrDefault()?.pin,
                app_step_id = x.FirstOrDefault()?.app_step_id,
                task_id = x.FirstOrDefault()?.task_id,
                documents = x.ToList(),
            }).ToList();

            return result;
        }

        public Task<application_step> GetOne(int id)
        {
            return unitOfWork.application_stepRepository.GetOne(id);
        }

        public async Task<application_step> Create(application_step domain)
        {
            var result = await unitOfWork.application_stepRepository.Add(domain);
            domain.id = result;

            // Логируем создание шага
            await LogStatusChange(domain.id, null, domain.status, "Шаг создан");

            unitOfWork.Commit();
            return domain;
        }

        public async Task<application_step> Pause(int stepId, string reason)
        {
            var result = await unitOfWork.application_stepRepository.GetOne(stepId);
            var oldStatus = result.status;

            result.comments = reason;
            result.status = "paused";
            result.is_paused = true;
            await unitOfWork.application_stepRepository.Update(result);

            // Логируем изменение статуса на паузу
            await LogStatusChange(stepId, oldStatus, "paused", reason);

            var pause = await unitOfWork.application_pauseRepository.Add(new application_pause
            {
                application_id = result.application_id,
                app_step_id = result.id,
                pause_reason = reason,
                pause_start = DateTime.Now,
            });

            unitOfWork.Commit();
            return result;
        }

        public async Task<Result<application_step>> Complete(int stepId)
        {
            var result = await unitOfWork.application_stepRepository.GetOne(stepId);

            var requiredSteps = await unitOfWork.step_required_documentRepository.GetAll();
            requiredSteps.Where(x => x.step_id == result.step_id).ToList();

            var appSteps = await unitOfWork.application_stepRepository.GetByapplication_id(result.application_id.Value);

            var workDocs = await unitOfWork.ApplicationWorkDocumentRepository.GetByAppStepIds(new int[] { stepId });
            if (workDocs.Any(x => x.is_required == true && x.file_id == null))
            {
                var docNames = workDocs.Where(x => x.is_required == true && x.file_id == null).Select(x => x.id_type_name).ToList();
                var msg = string.Join("<br/><br/>", docNames);

                return Result.Fail(new LogicError("Не хватает рабочих документов!<br/><br/>" + msg));
            }

            var approvals = await unitOfWork.document_approvalRepository.GetByAppStepIds(new int[] { stepId });
            if (approvals.Where(x => x.is_required_approver == true).Any(x => x.file_sign_id == null))
            {
                var docWithApprovals = approvals.GroupBy(x => x.document_name).Select(x => new { doc = x.Key, list = x.ToList() }).Select(x => x.doc + "<br/><br/>" + string.Join("<br/><br/>", x.list.Select(x => x.department_name + ": " + x.position_name)));
                var msg = string.Join("<br/><br/><br/>", docWithApprovals);

                return Result.Fail(new LogicError("Не хватает обязательных подписей для документов!<br/><br/>" + msg));
            }

            var appRequiredCalc = await unitOfWork.ApplicationRequiredCalcRepository.GetByApplicationId(result.application_id.Value);
            var applicationPayments = await unitOfWork.application_paymentRepository.GetByapplication_id(result.application_id.Value);
            var missingPayments = appRequiredCalc
                .Where(calc => applicationPayments.FirstOrDefault(p => p.structure_id == calc.structure_id) == null)
                .Select(calc => calc.structure_name)
                .ToList();
            if (missingPayments.Any())
            {
                var msg = string.Join("<br/><br/>", missingPayments);
                return Result.Fail(new LogicError("Не хватает обязательных оплат по структурам!<br/><br/>" + msg));
            }

            var oldStatus = result.status;
            result.status = "completed";
            result.completion_date = DateTime.Now;
            await unitOfWork.application_stepRepository.Update(result);

            // Логируем завершение шага
            await LogStatusChange(stepId, oldStatus, "completed", "Шаг завершен");

            unitOfWork.Commit();
            return result;
        }

        public async Task<FluentResults.Result<application_step>> ToProgress(int stepId)
        {
            var result = await unitOfWork.application_stepRepository.GetOne(stepId);

            var allDeps = await unitOfWork.step_dependencyRepository.GetAll();
            var needToDone = allDeps.Where(x => x.prerequisite_step_id == result.step_id).ToList();
            var ids = needToDone.Select(x => x.dependent_step_id).ToList();

            var appSteps = await unitOfWork.application_stepRepository.GetByapplication_id(result.application_id.Value);
            var needToBeDone = appSteps.Where(x => ids.Contains(x.step_id)).ToList();
            if (needToBeDone.Any(x => x.status != "completed"))
            {
                return Result.Fail(new LogicError("Предыдущие шаги не выполнены!<br/>" + string.Join(", ", needToDone.Select(x => x.dependent_step_name))));
            }

            var oldStatus = result.status;
            result.status = "in_progress";
            result.start_date = DateTime.Now;
            await unitOfWork.application_stepRepository.Update(result);

            // Логируем начало выполнения
            await LogStatusChange(stepId, oldStatus, "in_progress", "Шаг переведен в работу");

            unitOfWork.Commit();
            return result;
        }

        public async Task<application_step> Return(int stepId, string comment)
        {
            var result = await unitOfWork.application_stepRepository.GetOne(stepId);
            var oldStatus = result.status;

            result.status = "in_progress";
            await unitOfWork.application_stepRepository.Update(result);

            // НЕ логируем здесь, так как возврат логируется отдельно

            var deps = (await unitOfWork.step_dependencyRepository.GetAll()).Where(x => x.dependent_step_id != null && x.prerequisite_step_id != null).ToList();
            var steps = await unitOfWork.application_stepRepository.GetByapplication_id(result.application_id ?? 0);

            var step_ids = new List<int> { result.step_id ?? 0 };
            var i = 1;

            while (step_ids.Count != 0)
            {
                i++;
                step_ids = deps.Where(x => step_ids.Contains(x.dependent_step_id ?? 0)).Select(x => x.prerequisite_step_id ?? 0).ToList();

                foreach (var step_id in step_ids)
                {
                    var st = steps.FirstOrDefault(x => x.step_id == step_id);
                    if (st != null)
                    {
                        var oldStepStatus = st.status;
                        st.status = "waiting";
                        await unitOfWork.application_stepRepository.Update(st);

                        // Логируем изменение зависимых шагов
                        await LogStatusChange(st.id, oldStepStatus, "waiting", "Шаг переведен в ожидание из-за возврата");
                    }
                }

                if (i == 20) break;
            }

            unitOfWork.Commit();
            return result;
        }

        public async Task<application_step> Resume(int stepId)
        {
            var result = await unitOfWork.application_stepRepository.GetOne(stepId);
            var oldStatus = result.status;

            result.status = "in_progress";
            result.is_paused = false;
            await unitOfWork.application_stepRepository.Update(result);

            // Логируем возобновление
            await LogStatusChange(stepId, oldStatus, "in_progress", "Шаг возобновлен после паузы");

            var pause = await unitOfWork.application_pauseRepository.GetByapp_step_idAndCurrent(stepId);
            if (pause != null)
            {
                pause.pause_end = DateTime.Now;
            }
            await unitOfWork.application_pauseRepository.Update(pause);

            unitOfWork.Commit();
            return result;
        }

        public async Task<application_step> Update(application_step domain)
        {
            // Получаем текущий статус для сравнения
            var currentStep = await unitOfWork.application_stepRepository.GetOne(domain.id);
            var oldStatus = currentStep.status;

            await unitOfWork.application_stepRepository.Update(domain);

            // Логируем только если статус изменился
            if (oldStatus != domain.status)
            {
                await LogStatusChange(domain.id, oldStatus, domain.status, "Статус изменен через обновление");
            }

            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<application_step>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.application_stepRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.application_stepRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }

        public async Task<List<application_step>> GetByapplication_id(int application_id)
        {
            var res = await unitOfWork.application_stepRepository.GetByapplication_id(application_id);

            for (var i = 0; i < res.Count; i++)
            {
                var preqs = await unitOfWork.step_dependencyRepository.GetByprerequisite_step_id(res[i].step_id ?? 0);
                var blocks = await unitOfWork.step_dependencyRepository.GetBydependent_step_id(res[i].step_id ?? 0);
                res[i].dependencies = preqs.Select(x => x.dependent_step_id ?? 0).ToArray();
                res[i].blocks = blocks.Select(x => x.prerequisite_step_id ?? 0).ToArray();
            }

            return res;
        }

        public Task<List<application_step>> GetBystep_id(int step_id)
        {
            return unitOfWork.application_stepRepository.GetBystep_id(step_id);
        }
    }
}