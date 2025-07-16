using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class legal_act_registryUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public legal_act_registryUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<legal_act_registry>> GetAll()
        {
            return unitOfWork.legal_act_registryRepository.GetAll();
        }

        public Task<List<legal_act_registry>> GetByFilter(LegalFilter filter)
        {
            return unitOfWork.legal_act_registryRepository.GetByFilter(filter);
        }

        public Task<legal_act_registry> GetOne(int id)
        {
            return unitOfWork.legal_act_registryRepository.GetOne(id);
        }
        public async Task<legal_act_registry> Create(legal_act_registry domain)
        {

            domain.created_at = DateTime.Now;
            domain.updated_at = DateTime.Now;
            var result = await unitOfWork.legal_act_registryRepository.Add(domain);
            domain.id = result;

            foreach (var item in domain.legalObjects)
            {
                legal_act_object objectNew = new legal_act_object
                {
                    id_act = result,
                    id_object = item,
                    created_at = DateTime.Now,
                    updated_at = DateTime.Now,
                };

                await unitOfWork.legal_act_objectRepository.Add(objectNew);
            }

            foreach (var item in domain.assignees)
            {
                LegalActEmployee employeeNew = new LegalActEmployee
                {
                    id_act = result,
                    id_structure_employee = item,
                    created_at = DateTime.Now,
                    updated_at = DateTime.Now,
                    isActive = true
                };

                await unitOfWork.legalActEmployeeRepository.Add(employeeNew);
            }
            unitOfWork.Commit();
            return domain;
        }

        public async Task<legal_act_registry> Update(legal_act_registry domain)
        {


            var existingUnits = await unitOfWork.legal_act_objectRepository.GetByid_act(domain.id);

            var existingUnitIds = existingUnits.Select(u => u.id_act).ToList();

            domain.updated_at = DateTime.Now;
            await unitOfWork.legal_act_registryRepository.Update(domain);

            foreach (var item in domain.legalObjects)
            {
                if (!existingUnitIds.Contains(item))
                {
                    legal_act_object objectNew = new legal_act_object
                    {
                        created_at = DateTime.Now,
                        updated_at = DateTime.Now,
                        id_act = domain.id,
                        id_object = item,
                    };
                    await unitOfWork.legal_act_objectRepository.Add(objectNew);
                }
                else
                {
                    existingUnitIds.Remove(item);
                }
            }

            foreach (var idToRemove in existingUnitIds)
            {
                var unitToRemove = existingUnits.FirstOrDefault(u => u.id_act == idToRemove);
                if (unitToRemove != null)
                {
                    await unitOfWork.legal_act_objectRepository.Delete(unitToRemove.id);
                }
            }

            var existingEmployees = await unitOfWork.legalActEmployeeRepository.GetByIdAct(domain.id);
            var existingEmployeeIds = existingEmployees.Select(u => u.id_structure_employee).ToList();

            foreach (var item in domain.assignees)
            {
                if (!existingEmployeeIds.Contains(item))
                {
                    LegalActEmployee employeeNew = new LegalActEmployee
                    {
                        created_at = DateTime.Now,
                        updated_at = DateTime.Now,
                        id_act = domain.id,
                        id_structure_employee = item,
                        isActive = true
                    };
                    await unitOfWork.legalActEmployeeRepository.Add(employeeNew);
                }
                else
                {
                    existingEmployeeIds.Remove(item);
                }
            }

            foreach (var idToRemove in existingEmployeeIds)
            {
                var unitToRemove = existingEmployees.FirstOrDefault(u => u.id_act == idToRemove);
                if (unitToRemove != null)
                {
                    await unitOfWork.legalActEmployeeRepository.Delete(unitToRemove.id);
                }
            }
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<legal_act_registry>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.legal_act_registryRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {
            await unitOfWork.legal_act_registryRepository.Delete(id);
            unitOfWork.Commit();
            return id;
        }


        
        public Task<List<legal_act_registry>>  GetByid_status(int id_status)
        {
            return unitOfWork.legal_act_registryRepository.GetByid_status(id_status);
        }

        public Task<List<legal_act_registry>> GetByAddress( string address)
        {
            return unitOfWork.legal_act_registryRepository.GetByAddress(address);
        }
        
    }
}
