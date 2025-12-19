using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    /// <summary>
    /// UseCase для массового сохранения service_path со всеми дочерними данными
    /// </summary>
    public class ServicePathBulkUseCase
    {
        private readonly IUnitOfWork _unitOfWork;

        public ServicePathBulkUseCase(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Массовое сохранение всех данных в одной транзакции
        /// </summary>
        public async Task<BulkSaveResponse> BulkSave(BulkSaveServicePathRequest request)
        {
            var response = new BulkSaveResponse();

            try
            {
                // Транзакция уже начата в UnitOfWork, не нужно вызывать BeginTransaction

                // 1. Сохранить или обновить service_path
                var servicePath = await SaveServicePath(request.ServicePath);
                response.ServicePath = MapToModel(servicePath);

                // 2. Удалить помеченные записи (в правильном порядке - сначала дочерние)
                await DeleteMarkedItems(request);

                // 3. Сохранить path_steps и получить маппинг ID
                response.PathStepIdMap = await SavePathSteps(
                    request.PathSteps,
                    servicePath.id
                );

                // 4. Обновить ссылки в дочерних сущностях на реальные ID
                UpdateStepReferences(
                    request.StepRequiredDocuments,
                    request.StepPartners,
                    request.StepDependencies,
                    response.PathStepIdMap
                );

                // 5. Сохранить step_required_documents
                response.StepRequiredDocumentIdMap = await SaveStepRequiredDocuments(
                    request.StepRequiredDocuments
                );

                // 6. Обновить ссылки document_approvers на реальные ID документов
                UpdateDocumentReferences(
                    request.DocumentApprovers,
                    response.StepRequiredDocumentIdMap
                );

                // 7. Сохранить остальные дочерние сущности
                await SaveStepPartners(request.StepPartners);
                await SaveStepDependencies(request.StepDependencies);
                await SaveDocumentApprovers(request.DocumentApprovers);

                // Коммитим транзакцию
                _unitOfWork.Commit();

                response.Success = true;
                response.Message = "Данные успешно сохранены";
            }
            catch (Exception ex)
            {
                // Rollback при ошибке
                _unitOfWork.Rollback();
                response.Success = false;
                response.Message = $"Ошибка сохранения: {ex.Message}";
                throw;
            }

            return response;
        }

        /// <summary>
        /// Загрузить service_path со всеми дочерними данными
        /// </summary>
        public async Task<LoadServicePathWithChildrenResponse> LoadWithChildren(int servicePathId)
        {
            var response = new LoadServicePathWithChildrenResponse();

            // Загрузить основные данные
            var servicePath = await _unitOfWork.service_pathRepository.GetOne(servicePathId);
            response.ServicePath = MapToModel(servicePath);

            // Загрузить path_steps
            var pathSteps = await _unitOfWork.path_stepRepository.GetBypath_id(servicePathId);
            response.PathSteps = pathSteps.Select(MapToModel).ToList();

            // Загрузить step_required_documents для всех шагов
            foreach (var step in pathSteps)
            {
                var docs = await _unitOfWork.step_required_documentRepository.GetBystep_id(step.id);
                response.StepRequiredDocuments.AddRange(docs.Select(MapToModel));

                // Загрузить document_approvers для каждого документа
                foreach (var doc in docs)
                {
                    var approvers = await _unitOfWork.document_approverRepository.GetBystep_doc_id(doc.id);
                    response.DocumentApprovers.AddRange(approvers.Select(MapToModel));
                }
            }

            // Загрузить step_partners для всех шагов
            foreach (var step in pathSteps)
            {
                var partners = await _unitOfWork.step_partnerRepository.GetBystep_id(step.id);
                response.StepPartners.AddRange(partners.Select(MapToModel));
            }

            // Загрузить step_dependencies
            var dependencies = await _unitOfWork.step_dependencyRepository.GetByservice_path_id(servicePathId);
            response.StepDependencies = dependencies.Select(MapToModel).ToList();

            return response;
        }

        #region Private Methods - Сохранение

        private async Task<service_path> SaveServicePath(ServicePathModel model)
        {
            var domain = new service_path
            {
                id = model.Id,
                service_id = model.ServiceId,
                name = model.Name,
                description = model.Description,
                is_default = model.IsDefault,
                is_active = model.IsActive
            };

            if (model.Id <= 0)
            {
                var newId = await _unitOfWork.service_pathRepository.Add(domain);
                domain.id = newId;
            }
            else
            {
                await _unitOfWork.service_pathRepository.Update(domain);
            }

            return domain;
        }

        private async Task DeleteMarkedItems(BulkSaveServicePathRequest request)
        {
            // Удалить в правильном порядке (от дочерних к родительским)

            // 1. document_approvers
            foreach (var id in request.DocumentApproversToDelete ?? new List<int>())
            {
                await _unitOfWork.document_approverRepository.Delete(id);
            }

            // 2. step_dependencies
            foreach (var id in request.StepDependenciesToDelete ?? new List<int>())
            {
                await _unitOfWork.step_dependencyRepository.Delete(id);
            }

            // 3. step_partners
            foreach (var id in request.StepPartnersToDelete ?? new List<int>())
            {
                await _unitOfWork.step_partnerRepository.Delete(id);
            }

            // 4. step_required_documents
            foreach (var id in request.StepRequiredDocumentsToDelete ?? new List<int>())
            {
                await _unitOfWork.step_required_documentRepository.Delete(id);
            }

            // 5. path_steps (последними)
            foreach (var id in request.PathStepsToDelete ?? new List<int>())
            {
                await _unitOfWork.path_stepRepository.Delete(id);
            }
        }

        private async Task<Dictionary<int, int>> SavePathSteps(
            List<PathStepModel> steps,
            int servicePathId)
        {
            var idMap = new Dictionary<int, int>();

            foreach (var model in steps ?? new List<PathStepModel>())
            {
                var domain = new path_step
                {
                    id = model.Id > 0 ? model.Id : 0,
                    step_type = model.StepType,
                    path_id = servicePathId,
                    responsible_org_id = model.ResponsibleOrgId,
                    name = model.Name,
                    description = model.Description,
                    order_number = model.OrderNumber,
                    is_required = model.IsRequired,
                    estimated_days = model.EstimatedDays,
                    wait_for_previous_steps = model.WaitForPreviousSteps
                };

                if (model.IsNew || model.Id <= 0)
                {
                    var oldId = model.Id;
                    var newId = await _unitOfWork.path_stepRepository.Add(domain);
                    idMap[oldId] = newId;
                }
                else if (model.IsModified)
                {
                    await _unitOfWork.path_stepRepository.Update(domain);
                    idMap[model.Id] = model.Id;
                }
            }

            return idMap;
        }

        private void UpdateStepReferences(
            List<StepRequiredDocumentModel> documents,
            List<StepPartnerModel> partners,
            List<StepDependencyModel> dependencies,
            Dictionary<int, int> stepIdMap)
        {
            // Обновить step_id в documents
            foreach (var doc in documents ?? new List<StepRequiredDocumentModel>())
            {
                if (doc.StepId < 0 && stepIdMap.ContainsKey(doc.StepId))
                {
                    doc.StepId = stepIdMap[doc.StepId];
                }
            }

            // Обновить step_id в partners
            foreach (var partner in partners ?? new List<StepPartnerModel>())
            {
                if (partner.StepId < 0 && stepIdMap.ContainsKey(partner.StepId))
                {
                    partner.StepId = stepIdMap[partner.StepId];
                }
            }

            // Обновить step_id в dependencies
            foreach (var dep in dependencies ?? new List<StepDependencyModel>())
            {
                if (dep.DependentStepId < 0 && stepIdMap.ContainsKey(dep.DependentStepId))
                {
                    dep.DependentStepId = stepIdMap[dep.DependentStepId];
                }
                if (dep.PrerequisiteStepId < 0 && stepIdMap.ContainsKey(dep.PrerequisiteStepId))
                {
                    dep.PrerequisiteStepId = stepIdMap[dep.PrerequisiteStepId];
                }
            }
        }

        private async Task<Dictionary<int, int>> SaveStepRequiredDocuments(
            List<StepRequiredDocumentModel> documents)
        {
            var idMap = new Dictionary<int, int>();

            foreach (var model in documents ?? new List<StepRequiredDocumentModel>())
            {
                var domain = new step_required_document
                {
                    id = model.Id > 0 ? model.Id : 0,
                    step_id = model.StepId,
                    document_type_id = model.DocumentTypeId,
                    is_required = model.IsRequired
                };

                if (model.IsNew || model.Id <= 0)
                {
                    var oldId = model.Id;
                    var newId = await _unitOfWork.step_required_documentRepository.Add(domain);
                    idMap[oldId] = newId;
                }
                else if (model.IsModified)
                {
                    await _unitOfWork.step_required_documentRepository.Update(domain);
                    idMap[model.Id] = model.Id;
                }
            }

            return idMap;
        }

        private void UpdateDocumentReferences(
            List<DocumentApproverModel> approvers,
            Dictionary<int, int> documentIdMap)
        {
            foreach (var approver in approvers ?? new List<DocumentApproverModel>())
            {
                if (approver.StepDocId < 0 && documentIdMap.ContainsKey(approver.StepDocId))
                {
                    approver.StepDocId = documentIdMap[approver.StepDocId];
                }
            }
        }

        private async Task SaveStepPartners(List<StepPartnerModel> partners)
        {
            foreach (var model in partners ?? new List<StepPartnerModel>())
            {
                var domain = new step_partner
                {
                    id = model.Id > 0 ? model.Id : 0,
                    is_required = model.IsRequired,
                    partner_id = model.PartnerId,  // ✅ ИСПРАВЛЕНО: используем partner_id
                    role = model.Role,              // ✅ ИСПРАВЛЕНО: добавлено поле role
                    step_id = model.StepId
                };

                if (model.IsNew || model.Id <= 0)
                {
                    await _unitOfWork.step_partnerRepository.Add(domain);
                }
                else if (model.IsModified)
                {
                    await _unitOfWork.step_partnerRepository.Update(domain);
                }
            }
        }

        private async Task SaveStepDependencies(List<StepDependencyModel> dependencies)
        {
            foreach (var model in dependencies ?? new List<StepDependencyModel>())
            {
                var domain = new step_dependency
                {
                    id = model.Id > 0 ? model.Id : 0,
                    dependent_step_id = model.DependentStepId,
                    prerequisite_step_id = model.PrerequisiteStepId,
                    is_strict = model.IsStrict
                };

                if (model.IsNew || model.Id <= 0)
                {
                    await _unitOfWork.step_dependencyRepository.Add(domain);
                }
                else if (model.IsModified)
                {
                    await _unitOfWork.step_dependencyRepository.Update(domain);
                }
            }
        }

        private async Task SaveDocumentApprovers(List<DocumentApproverModel> approvers)
        {
            foreach (var model in approvers ?? new List<DocumentApproverModel>())
            {
                var domain = new document_approver
                {
                    id = model.Id > 0 ? model.Id : 0,
                    step_doc_id = model.StepDocId,
                    department_id = model.DepartmentId,
                    position_id = model.PositionId,
                    is_required = model.IsRequired,
                    approval_order = model.ApprovalOrder
                };

                if (model.IsNew || model.Id <= 0)
                {
                    await _unitOfWork.document_approverRepository.Add(domain);
                }
                else if (model.IsModified)
                {
                    await _unitOfWork.document_approverRepository.Update(domain);
                }
            }
        }

        #endregion

        #region Private Methods - Маппинг

        private ServicePathModel MapToModel(service_path domain)
        {
            return new ServicePathModel
            {
                Id = domain.id,
                ServiceId = domain.service_id ?? 0,
                Name = domain.name,
                Description = domain.description,
                IsDefault = domain.is_default ?? false,
                IsActive = domain.is_active ?? false
            };
        }

        private PathStepModel MapToModel(path_step domain)
        {
            return new PathStepModel
            {
                Id = domain.id,
                StepType = domain.step_type,
                PathId = domain.path_id ?? 0,
                ResponsibleOrgId = domain.responsible_org_id ?? 0,
                Name = domain.name,
                Description = domain.description,
                OrderNumber = domain.order_number,
                IsRequired = domain.is_required ?? false,
                EstimatedDays = domain.estimated_days ?? 0,
                WaitForPreviousSteps = domain.wait_for_previous_steps ?? false,
                IsNew = false,
                IsModified = false
            };
        }

        private StepRequiredDocumentModel MapToModel(step_required_document domain)
        {
            return new StepRequiredDocumentModel
            {
                Id = domain.id,
                StepId = domain.step_id ?? 0,
                DocumentTypeId = domain.document_type_id ?? 0,
                IsRequired = domain.is_required ?? false,
                IsNew = false,
                IsModified = false
            };
        }

        private StepPartnerModel MapToModel(step_partner domain)
        {
            return new StepPartnerModel
            {
                Id = domain.id,
                IsRequired = domain.is_required ?? false,
                PartnerId = domain.partner_id ?? 0,     // ✅ ИСПРАВЛЕНО: используем partner_id
                Role = domain.role,                      // ✅ ИСПРАВЛЕНО: добавлено поле role
                StepId = domain.step_id ?? 0,
                IsNew = false,
                IsModified = false
            };
        }

        private StepDependencyModel MapToModel(step_dependency domain)
        {
            return new StepDependencyModel
            {
                Id = domain.id,
                ServicePathId = 0, // Не хранится в БД
                DependentStepId = domain.dependent_step_id ?? 0,
                PrerequisiteStepId = domain.prerequisite_step_id ?? 0,
                IsStrict = domain.is_strict ?? false,
                IsNew = false,
                IsModified = false
            };
        }

        private DocumentApproverModel MapToModel(document_approver domain)
        {
            return new DocumentApproverModel
            {
                Id = domain.id,
                StepDocId = domain.step_doc_id ?? 0,
                DepartmentId = domain.department_id ?? 0,
                PositionId = domain.position_id ?? 0,
                IsRequired = domain.is_required ?? false,
                ApprovalOrder = domain.approval_order,
                IsNew = false,
                IsModified = false
            };
        }

        #endregion
    }
}