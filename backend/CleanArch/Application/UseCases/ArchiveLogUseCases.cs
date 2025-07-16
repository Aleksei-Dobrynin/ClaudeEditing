using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class ArchiveLogUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ArchiveLogUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<ArchiveLog>> GetAll()
        {
            return unitOfWork.ArchiveLogRepository.GetAll();
        }
        
        public async Task<ArchiveLog> GetGroupByParentID(int id)
        {
            var archiveLog = await unitOfWork.ArchiveLogRepository.GetGroupByParentID(id);
            var acrhObject = new List<int?>();
            foreach (var item in archiveLog)
            {
                acrhObject.Add(item.archive_object_id);
            }
            var acrhObjects = await unitOfWork.ArchiveObjectRepository.GetListByIDs(acrhObject);
            var log = archiveLog.FirstOrDefault();
            log.archiveObjects ??= new List<ArchiveObjectsInLog>();
            log.archiveObjects?.AddRange(acrhObjects.Select(item => new ArchiveObjectsInLog
            {
                id = item.id,
                doc_number = item.doc_number,
                address = item.address,
            }));
            return log;
        }
        
        public Task<ArchiveLog> GetOneByID(int id)
        {
            return unitOfWork.ArchiveLogRepository.GetOneByID(id);
        }
        
        public Task<List<ArchiveLog>> GetByFilter(ArchiveLogFilter filter)
        {
            return unitOfWork.ArchiveLogRepository.GetByFilter(filter);
        }

        public async Task<ArchiveLog> Create(ArchiveLog domain)
        {
            if (domain.status_id.HasValue && domain.status_id == 0)
            {
                var issuedStatus = await unitOfWork.ArchiveLogStatusRepository.GetOneByCode("issued");
                domain.status_id = issuedStatus.id;
            }
            if (!domain.date_take.HasValue)
            {
                domain.date_take = DateTime.Now;
            }

            //TODO Check if archive can add objects records, if not or delete this 
            if (domain.archiveObjects != null && domain.archiveObjects.Count > 0)
            {
                var parent_id = 0;
                foreach (var item in domain.archiveObjects)
                {
                    if (item.id == 0)
                    {
                        var objID = await unitOfWork.ArchiveObjectRepository.Add(new ArchiveObject
                        {
                            doc_number = item.doc_number, 
                            address = item.address
                        });
                        unitOfWork.Commit();
                        domain.archive_object_id = objID;
                        domain.doc_number = item.doc_number;
                        domain.address = item.address;
                    }
                    else
                    {
                        domain.archive_object_id = item.id;
                        domain.doc_number = item.doc_number;
                        domain.address = item.address;
                    }
                    domain.is_group = true;
                    domain.parent_id = parent_id != 0 ? parent_id : null;
                    
                    var result = await unitOfWork.ArchiveLogRepository.Add(domain);
                    if (parent_id == 0)
                    {
                        parent_id = result;
                        domain.parent_id = parent_id;
                    }
                    unitOfWork.Commit();
                }
                return domain;
            }
            else
            {
                var result = await unitOfWork.ArchiveLogRepository.Add(domain);
                domain.id = result;
                unitOfWork.Commit();
                return domain;
            }
        }
        
        public async Task<int> ChangeStatus(int archive_log_id, int status_id)
        {
            var res = await unitOfWork.ArchiveLogRepository.ChangeStatus(archive_log_id, status_id);
            unitOfWork.Commit();
            return res;
        }

        public async Task<ArchiveLog> Update(ArchiveLog domain)
        {

            //TODO Check if archive can add objects records, if not or delete this 
            if (domain.archiveObjects != null && domain.archiveObjects.Count > 0)
            {
                var archiveLog = await unitOfWork.ArchiveLogRepository.GetGroupByParentID(domain.id);
                foreach (var item in archiveLog)
                {
                    var request = new ArchiveLog
                    {
                        id = item.id,
                        doc_number = domain.doc_number,
                        address = domain.address,
                        status_id = domain.status_id,
                        date_return = domain.date_return,
                        deadline = domain.deadline,
                        take_structure_id = domain.take_structure_id,
                        take_employee_id = domain.take_employee_id,
                        return_structure_id = domain.return_structure_id,
                        return_employee_id = domain.return_employee_id,
                        date_take = domain.date_take,
                        name_take = domain.name_take,
                        is_group = domain.is_group,
                        parent_id = domain.parent_id,
                        archive_folder_id = domain.archive_folder_id,
                    };
                    await unitOfWork.ArchiveLogRepository.Update(request);
                    unitOfWork.Commit();
                    return domain;
                }
            }
            else
            {
                await unitOfWork.ArchiveLogRepository.Update(domain);
                unitOfWork.Commit();
                return domain;
            }

            return null;
        }

        public Task<PaginatedList<ArchiveLog>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ArchiveLogRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ArchiveLogRepository.Delete(id);
            unitOfWork.Commit();
        }

        public Task<List<ArchiveLogPivot>> GetForPivotDashboard(DateTime date_start, DateTime date_end)
        {
            return unitOfWork.application_taskRepository.GetForPivotDashboard(date_start, date_end);
        }        
        
        public async Task<List<ArchiveLogPivot>> GetForPivotDashboardMyStructure(DateTime date_start, DateTime date_end)
        {
            var user_id = await unitOfWork.UserRepository.GetUserUID();
            return await unitOfWork.application_taskRepository.GetForPivotDashboard(date_start, date_end, user_id);
        }
    }
}
