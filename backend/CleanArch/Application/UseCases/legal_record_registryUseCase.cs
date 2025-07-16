using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class legal_record_registryUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public legal_record_registryUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<legal_record_registry>> GetAll()
        {
            return unitOfWork.legal_record_registryRepository.GetAll();
        }

        public Task<List<legal_record_registry>> GetByFilter(LegalFilter filter)
        {
            return unitOfWork.legal_record_registryRepository.GetByFilter(filter);
        }

        public Task<legal_record_registry> GetOne(int id)
        {
            return unitOfWork.legal_record_registryRepository.GetOne(id);
        }
        public async Task<legal_record_registry> Create(legal_record_registry domain)
        {
            domain.created_at = DateTime.Now;
            domain.updated_at = DateTime.Now;
            var result = await unitOfWork.legal_record_registryRepository.Add(domain);
            domain.id = result;

            foreach (var item in domain.legalObjects)
            {
                legal_record_object objectNew = new legal_record_object
                {
                    id_record = result,
                    id_object = item,
                    created_at = DateTime.Now,
                    updated_at = DateTime.Now,
                };

                await unitOfWork.legal_record_objectRepository.Add(objectNew);
            }

            foreach (var item in domain.assignees)
            {
                LegalRecordEmployee employeeNew = new LegalRecordEmployee
                {
                    id_record = result,
                    id_structure_employee = item,
                    created_at = DateTime.Now,
                    updated_at = DateTime.Now,
                    isActive = true

                };

                await unitOfWork.legalRecordEmployeeRepository.Add(employeeNew);
            }
            unitOfWork.Commit();
            return domain;
        }

        public async Task<legal_record_registry> Update(legal_record_registry domain)
        {

            var existingUnits = await unitOfWork.legal_record_objectRepository.GetByid_record(domain.id);

            var existingUnitIds = existingUnits.Select(u => u.id_record).ToList();

            domain.updated_at = DateTime.Now;
            await unitOfWork.legal_record_registryRepository.Update(domain);

            foreach (var item in domain.legalObjects)
            {
                if (!existingUnitIds.Contains(item))
                {
                    legal_record_object objectNew = new legal_record_object
                    {
                        created_at = DateTime.Now,
                        updated_at = DateTime.Now,
                        id_record = domain.id,
                        id_object = item,
                    };
                    await unitOfWork.legal_record_objectRepository.Add(objectNew);
                }
                else
                {
                    existingUnitIds.Remove(item);
                }
            }

            foreach (var idToRemove in existingUnitIds)
            {
                var unitToRemove = existingUnits.FirstOrDefault(u => u.id_record == idToRemove);
                if (unitToRemove != null)
                {
                    await unitOfWork.legal_record_objectRepository.Delete(unitToRemove.id);
                }
            }

            var existingEmployees = await unitOfWork.legalRecordEmployeeRepository.GetByIdRecord(domain.id);
            var existingEmployeeIds = existingEmployees.Select(u => u.id_structure_employee).ToList();

            foreach (var item in domain.assignees)
            {
                if (!existingEmployeeIds.Contains(item))
                {
                    LegalRecordEmployee employeeNew = new LegalRecordEmployee
                    {
                        created_at = DateTime.Now,
                        updated_at = DateTime.Now,
                        id_record = domain.id,
                        id_structure_employee = item,
                        isActive = true
                    };
                    await unitOfWork.legalRecordEmployeeRepository.Add(employeeNew);
                }
                else
                {
                    existingEmployeeIds.Remove(item);
                }
            }

            foreach (var idToRemove in existingEmployeeIds)
            {
                var unitToRemove = existingEmployees.FirstOrDefault(u => u.id_record == idToRemove);
                if (unitToRemove != null)
                {
                    await unitOfWork.legalRecordEmployeeRepository.Delete(unitToRemove.id);
                }
            }

            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<legal_record_registry>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.legal_record_registryRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.legal_record_registryRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<legal_record_registry>>  GetByid_status(int id_status)
        {
            return unitOfWork.legal_record_registryRepository.GetByid_status(id_status);
        }

        public Task<List<legal_record_registry>> GetByAddress(string address)
        {
            return unitOfWork.legal_record_registryRepository.GetByAddress(address);
        }

    }
}
