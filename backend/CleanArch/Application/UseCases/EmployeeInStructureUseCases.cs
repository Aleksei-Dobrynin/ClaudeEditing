using Application.Models;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Application.UseCases
{
    public class EmployeeInStructureUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly ISendNotification sendNotification;

        public EmployeeInStructureUseCases(IUnitOfWork unitOfWork, ISendNotification SendNotification)
        {
            this.unitOfWork = unitOfWork;
            this.sendNotification = SendNotification;
        }

        public Task<List<EmployeeInStructure>> GetAll()
        {
            return unitOfWork.EmployeeInStructureRepository.GetAll();
        } 
        
        public async Task<List<EmployeeInStructure>> GetInMyStructure()
        {
            var userId = await unitOfWork.UserRepository.GetUserID();
            var emp = await unitOfWork.EmployeeRepository.GetByUserId(userId);
            if (emp == null) return new List<EmployeeInStructure>();
            var org = await unitOfWork.EmployeeInStructureRepository.GetByidEmployee(emp.id);
            var curr_org = org.Where(x => x.date_start < DateTime.Now && (x.date_end == null || x.date_end > DateTime.Now)).FirstOrDefault();
            return await unitOfWork.EmployeeInStructureRepository.GetByEmployeeStructureId(curr_org?.structure_id ?? 0, emp.id);
        }


        public async Task<int> GetMyCurrentStructure()
        {
            var userId = await unitOfWork.UserRepository.GetUserID();
            var emp = await unitOfWork.EmployeeRepository.GetByUserId(userId);
            if (emp == null) return 0;
            var org = await unitOfWork.EmployeeInStructureRepository.GetByidEmployee(emp.id);
            var curr_org = org.Where(x => x.date_start < DateTime.Now && (x.date_end == null || x.date_end > DateTime.Now)).FirstOrDefault();
            if(curr_org != null)
            {
                var structure = await unitOfWork.OrgStructureRepository.GetOne(curr_org.structure_id);
                return structure.id;
            }
            return 0;
        }

        public async Task<List<EmployeeInStructure>> GetInMyStructureHistory()
        {
            var userId = await unitOfWork.UserRepository.GetUserID();
            var emp = await unitOfWork.EmployeeRepository.GetByUserId(userId);
            if (emp == null) return new List<EmployeeInStructure>();
            var org = await unitOfWork.EmployeeInStructureRepository.GetByidEmployee(emp.id);
            var curr_org = org.Where(x => x.date_start < DateTime.Now && (x.date_end == null || x.date_end > DateTime.Now)).FirstOrDefault();
            return await unitOfWork.EmployeeInStructureRepository.GetByEmployeeStructureIdHistory(curr_org?.structure_id ?? 0, emp.id);
        }

        

        public Task<EmployeeInStructure> GetOneByID(int id)
        {
            return unitOfWork.EmployeeInStructureRepository.GetOneByID(id);
        }

        public Task<List<EmployeeInStructure>> GetByidStructure(int idStructure)
        {
            return unitOfWork.EmployeeInStructureRepository.GetByidStructure(idStructure);
        }
        public Task<List<EmployeeInStructure>> GetByidEmployee(int idEmployee)
        {
            return unitOfWork.EmployeeInStructureRepository.GetByidEmployee(idEmployee);
        }
        public Task<List<EmployeeInStructure>> GetByEmployeeStructureId(int idStructure)
        {
            return unitOfWork.EmployeeInStructureRepository.GetByEmployeeStructureId(idStructure, null);
        }

     
        public async Task<EmployeeInStructure> Create(EmployeeInStructure domain)
        {
            
            var result = await unitOfWork.EmployeeInStructureRepository.Add(domain);
            domain.id = result;

            var userId = await unitOfWork.EmployeeRepository.GetUserIdByEmployeeID(domain.employee_id);

            unitOfWork.Commit();

            if (userId != null)
            {
                var org = await unitOfWork.OrgStructureRepository.GetOne(domain.structure_id);
                var post = await unitOfWork.StructurePostRepository.GetOneByID(domain.post_id);

                var param = new Dictionary<string, string>();
                param.Add("org_name", org.name);
                param.Add("post_name", post.name);
                await sendNotification.SendNotification("added_to_structure", domain.employee_id, param);

            }
            return domain;
        }

        public async Task<EmployeeInStructure> Update(EmployeeInStructure domain)
        {
            await unitOfWork.EmployeeInStructureRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<EmployeeInStructure>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.EmployeeInStructureRepository.GetPaginated(pageSize, pageNumber);
        }
        public async Task<bool> CheckIsHeadStructure(int employee_id)
        {
            var res = await unitOfWork.EmployeeInStructureRepository.GetEmployeesHeadStructures(employee_id);
            return res.Count > 0;
        }
        
        public async Task Delete(int id)
        {
            await unitOfWork.EmployeeInStructureRepository.Delete(id);
            unitOfWork.Commit();
        }
        public async Task FireEmployee(int id)
        {
            var eis = await unitOfWork.EmployeeInStructureRepository.GetOneByID(id);
            eis.date_end = DateTime.Now;
            await unitOfWork.EmployeeInStructureRepository.Update(eis);
            unitOfWork.Commit();
        }
    }
}
