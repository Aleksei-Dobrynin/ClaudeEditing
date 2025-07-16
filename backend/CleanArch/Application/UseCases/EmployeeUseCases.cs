using Application.Models;
using Application.Repositories;
using Application.Services;
using Domain.Entities;

namespace Application.UseCases
{
    public class EmployeeUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IAuthRepository _authRepository;
        private readonly IN8nService _n8nService;

        public EmployeeUseCases(IUnitOfWork unitOfWork, IAuthRepository authRepository, IN8nService n8nService)
        {
            this.unitOfWork = unitOfWork;
            _authRepository = authRepository;
            _n8nService = n8nService;
        }

        public async Task CreateUser(int employeeId, string email)
        {
            var employee = await unitOfWork.EmployeeRepository.GetOneByID(employeeId);
            if (string.IsNullOrEmpty(email))
            {
                email = employee.email;
            }
            else
            {
                employee.email = email;
            }
            var newPassword = Guid.NewGuid().ToString();
            var userId = await _authRepository.Create(email, newPassword);
            employee.user_id = userId;
            await _n8nService.UserSendPassword(email, newPassword);
            await unitOfWork.EmployeeRepository.Update(employee);
            unitOfWork.Commit();
            await unitOfWork.UserRepository.Add(new User { userId = userId, email = email });
            unitOfWork.Commit();
        }

        public Task<List<Employee>> GetAll()
        {
            return unitOfWork.EmployeeRepository.GetAll();
        }
        
        public Task<List<Employee>> GetAllRegister()
        {
            return unitOfWork.EmployeeRepository.GetAllRegister();
        }

        public Task<Employee> GetOneByID(int id)
        {
            return unitOfWork.EmployeeRepository.GetOneByID(id);
        }

        public Task<Employee> GetByUserId(string userId)
        {
            return unitOfWork.EmployeeRepository.GetByUserId(userId);
        }

        public Task<List<Employee>> GetByApplicationId(int application_id)
        {
            return unitOfWork.EmployeeRepository.GetAll();
        }

        
        public async Task<Employee> Create(Employee domain)
        {
            domain.guid = Guid.NewGuid().ToString();
            var result = await unitOfWork.EmployeeRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        public async Task<Employee> GetUser()
        {
            var result = await unitOfWork.EmployeeRepository.GetUser();
            result.head_of_structures = await unitOfWork.EmployeeInStructureRepository.HeadOfStructures(result.id);
            var data = await unitOfWork.EmployeeInStructureRepository.GetByidEmployee(result.id);
            var today = DateTime.Now.Date;
            result.my_structures = data.Where(x => x.date_start.Date <= today && (x.date_end == null || x.date_end.Value.Date >= today)).ToList();
            result.post_ids = data.Where(x => x.date_start.Date <= today && (x.date_end == null || x.date_end.Value.Date >= today)).Select(x => x.post_id).ToList();
            //var last_release = await unitOfWork.releaseRepository.GetLastRelease();
            result.release_read = await unitOfWork.release_seenRepository.LastReleaseRead(result.uid ?? 0);

            return result;
        }

        public async Task<Employee> GetInfoDashboard()
        {
            var result = await unitOfWork.EmployeeRepository.GetUser();
            result.dashboard_head_of_structures = await unitOfWork.EmployeeInStructureRepository.DashboardHeadOfStructures(result.id);
            result.dashboard_services = await unitOfWork.EmployeeInStructureRepository.DashboardServices(result.id);
            return result;
        }

        public async Task<Employee> GetEmployeeDashboardInfo()
        {
            var result = await unitOfWork.EmployeeRepository.GetUser();
            result.dashboard_structures = await unitOfWork.EmployeeInStructureRepository.DashboardStructures(result.id);
            result.dashboard_services = await unitOfWork.EmployeeInStructureRepository.DashboardServices(result.id);
            return result;
        }


        public async Task<Employee> Update(Employee domain)
        {
            await unitOfWork.EmployeeRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<Employee>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.EmployeeRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.EmployeeRepository.Delete(id);
            unitOfWork.Commit();
        }
        public async Task<Employee> GetEmployeeByToken()
        {
            var response = await unitOfWork.EmployeeRepository.GetEmployeeByToken();
            return response;
        }
        public async Task<Employee> UpdateInitials(EmployeeInitials domain)
        {
            var response = await unitOfWork.EmployeeRepository.UpdateInitials(domain);
            unitOfWork.Commit();
            return response;
        }

    }
    
}