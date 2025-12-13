using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class ServiceUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public ServiceUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<Service>> GetAll()
        {
            return unitOfWork.ServiceRepository.GetAll();
        }

        public async Task<List<Service>> GetMyStructure()
        {
            var user_id = await unitOfWork.UserRepository.GetUserUID();

            if (user_id == "2137758e-0770-4e2a-84a2-17b3048f3a48" || user_id == "fc14bd43-a852-4769-b48c-6e0df71b4c1c" || user_id == "9d253aff-9d91-4b9d-991b-ea415a7a3762" || user_id == "df0f1708-dc6d-433a-af54-999b6fcdd367")
            {
                var all = await unitOfWork.ServiceRepository.GetAll();
                var res = all.Where(x => x.name != null && x.name.StartsWith("РА")).ToList();
                return res;
            }

            var result = await unitOfWork.ServiceRepository.GetMyStructure(user_id);
            return result;
        }

        public Task<Service> GetOneByID(int id)
        {
            return unitOfWork.ServiceRepository.GetOneByID(id);
        }

        public async Task<Service> Create(Service domain)
        {
            var result = await unitOfWork.ServiceRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();
            return domain;
        }

        /// <summary>
        /// Получает все активные услуги (у которых есть активный service_path)
        /// </summary>
        public Task<List<Service>> GetAllActive()
        {
            return unitOfWork.ServiceRepository.GetAllActive();
        }


        public async Task<Service> Update(Service domain)
        {
            await unitOfWork.ServiceRepository.Update(domain);
            unitOfWork.Commit();
            return domain;
        }

        public Task<PaginatedList<Service>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ServiceRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task Delete(int id)
        {
            await unitOfWork.ServiceRepository.Delete(id);
            unitOfWork.Commit();
        }
        public async Task<ResultDashboard> DashboardGetCountServices(DateTime date_start, DateTime date_end, int structure_id)
        {
            return await unitOfWork.ServiceRepository.DashboardGetCountServices(date_start, date_end, structure_id);
        }

        public async Task<ResultDashboard> DashboardGetCountServicesForMyStructure(DateTime date_start, DateTime date_end)
        {
            var result = await unitOfWork.EmployeeRepository.GetUser();
            var structures = await unitOfWork.EmployeeInStructureRepository.HeadOfStructures(result.id);
            var structure_id = structures[0].id;
            return await unitOfWork.ServiceRepository.DashboardGetCountServices(date_start, date_end, structure_id);
        }
        public async Task<ResultDashboard> DashboardGetAppsByStatusAndStructure(DateTime date_start, DateTime date_end, int structure_id, string status_name)
        {
            return await unitOfWork.ServiceRepository.DashboardGetAppsByStatusAndStructure(date_start, date_end, structure_id, status_name);
        }
        public async Task<ResultDashboard> DashboardGetFinance(DateTime date_start, DateTime date_end, int structure_id)
        {
            return await unitOfWork.ServiceRepository.DashboardGetFinance(date_start, date_end, structure_id);
        }
        public async Task<ResultDashboard> DashboardGetPaymentFinance(DateTime date_start, DateTime date_end, int structure_id)
        {
            return await unitOfWork.ServiceRepository.DashboardGetPaymentFinance(date_start, date_end, structure_id);
        }
        public async Task<ResultDashboard> DashboardGetCountTasks(DateTime date_start, DateTime date_end, int structure_id)
        {
            return await unitOfWork.ServiceRepository.DashboardGetCountTasks(date_start, date_end, structure_id);
        }

        public async Task<ResultDashboard> DashboardGetCountTasksForMyStructure(DateTime date_start, DateTime date_end)
        {
            var result = await unitOfWork.EmployeeRepository.GetUser();
            var structures = await unitOfWork.EmployeeInStructureRepository.HeadOfStructures(result.id);
            var structure_id = structures[0].id;
            return await unitOfWork.ServiceRepository.DashboardGetCountTasks(date_start, date_end, structure_id);
        }
        public async Task<ResultDashboard> DashboardGetCountUserApplications(DateTime date_start, DateTime date_end)
        {
            return await unitOfWork.ServiceRepository.DashboardGetCountUserApplications(date_start, date_end);
        }

        public async Task<ResultDashboard> DashboardGetCountUserApplicationsMyStructure(DateTime date_start, DateTime date_end)
        {
            var user_id = await unitOfWork.UserRepository.GetUserUID();
            return await unitOfWork.ServiceRepository.DashboardGetCountUserApplications(date_start, date_end, user_id);
        }

        public async Task<ResultDashboard> DashboardGetAppCount(DateTime date_start, DateTime date_end, int service_id, int status_id)
        {
            return await unitOfWork.ServiceRepository.DashboardGetAppCount(date_start, date_end, service_id, status_id);
        }

        public async Task<ResultDashboard> DashboardGetAppCountMyStructure(DateTime date_start, DateTime date_end, int service_id, int status_id)
        {
            var user_id = await unitOfWork.UserRepository.GetUserUID();
            return await unitOfWork.ServiceRepository.DashboardGetAppCount(date_start, date_end, service_id, status_id, user_id);
        }
        public async Task<ResultDashboard> GetForFinanceInvoice(DateTime date_start, DateTime date_end)
        {
            return await unitOfWork.ServiceRepository.GetForFinanceInvoice(date_start, date_end);
        }
        public async Task<List<ArchObjectLeaflet>> GetApplicationsWithCoords(DateTime date_start, DateTime date_end, int service_id, string status_code, int tag_id)
        {
            return await unitOfWork.ServiceRepository.GetApplicationsWithCoords(date_start, date_end, service_id, status_code, tag_id);
        }
        
        public async Task<List<ArchObjectLeaflet>> GetApplicationsWithCoords(DateTime date_start, DateTime date_end, int[] service_ids, string status_code, int[] tag_ids)
        {
            return await unitOfWork.ServiceRepository.GetApplicationsWithCoords(date_start, date_end, service_ids, status_code, tag_ids);
        }
        
        public async Task<List<ArchObjectLeaflet>> GetApplicationsWithCoordsByHeadStructure(DateTime date_start, DateTime date_end, int[] service_ids, string status_code, int[] tag_ids)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            var structure_ids = await unitOfWork.EmployeeInStructureRepository.GetInMyStructure(user_id);
            return await unitOfWork.ServiceRepository.GetApplicationsWithCoordsByStructures(date_start, date_end, service_ids, status_code, tag_ids, structure_ids.Select(x => x.structure_id).Distinct().ToList());
        }
        public async Task<List<ArchObjectLeaflet>> GetApplicationsWithCoordsByHeadStructure(DateTime date_start, DateTime date_end, int service_id, string status_code, int tag_id)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            var structure_ids = await unitOfWork.EmployeeInStructureRepository.GetInMyStructure(user_id);
            return await unitOfWork.ServiceRepository.GetApplicationsWithCoordsByStructures(date_start, date_end, service_id, status_code, tag_id, structure_ids.Select(x => x.structure_id).Distinct().ToList());
        }
        public async Task<ResultDashboard> DashboardGetCountObjects(int district_id)
        {
            return await unitOfWork.ServiceRepository.DashboardGetCountObjects(district_id);
        }
        public async Task<ResultDashboard> GetApplicationCountHour(DateTime date_start, DateTime date_end)
        {
            return await unitOfWork.ServiceRepository.GetApplicationCountHour(date_start, date_end);
        }

        public async Task<ResultDashboard> GetApplicationCountHourMyStructure(DateTime date_start, DateTime date_end)
        {
            var user_id = await unitOfWork.UserRepository.GetUserUID();
            return await unitOfWork.ServiceRepository.GetApplicationCountHour(date_start, date_end, user_id);
        }

        public async Task<ResultDashboard> GetApplicationCountWeek(DateTime date_start, DateTime date_end)
        {
            return await unitOfWork.ServiceRepository.GetApplicationCountWeek(date_start, date_end);
        }

        public async Task<ResultDashboard> GetApplicationCountWeekMyStructure(DateTime date_start, DateTime date_end)
        {
            var user_id = await unitOfWork.UserRepository.GetUserUID();
            return await unitOfWork.ServiceRepository.GetApplicationCountWeek(date_start, date_end, user_id);
        }
        public async Task<ResultDashboard> GetArchiveCount(DateTime date_start, DateTime date_end)
        {
            return await unitOfWork.ServiceRepository.GetArchiveCount(date_start, date_end);
        }

        public async Task<ResultDashboard> GetArchiveCountMyStructure(DateTime date_start, DateTime date_end)
        {
            var user_id = await unitOfWork.UserRepository.GetUserUID();
            return await unitOfWork.ServiceRepository.GetArchiveCount(date_start, date_end, user_id);
        }
        public async Task<List<ChartTableDataDashboard>> DashboardGetIssuedAppsRegister(DateTime date_start, DateTime date_end)
        {
            return await unitOfWork.ServiceRepository.DashboardGetIssuedAppsRegister(date_start, date_end);
        }

        public async Task<List<ChartTableDataDashboardStructure>> DashboardGetCountTaskByStructure(DateTime date_start, DateTime date_end)
        {
            return await unitOfWork.ServiceRepository.DashboardGetCountTaskByStructure(date_start, date_end);
        }
        public async Task<List<ChartTableDataDashboardStructure>> DashboardGetCountBySelectedStructure(DateTime date_start, DateTime date_end, int structure_id)
        {
            return await unitOfWork.ServiceRepository.DashboardGetCountBySelectedStructure(date_start, date_end, structure_id);
        }
        public async Task<List<ChartTableDataDashboardStructure>> DashboardGetRefucalCountBySelectedStructure(DateTime date_start, DateTime date_end, int structure_id)
        {
            return await unitOfWork.ServiceRepository.DashboardGetRefucalCountBySelectedStructure(date_start, date_end, structure_id);
        }

        public async Task<List<ChartTableDataDashboardStructure>> DashboardGetCountLateBySelectedStructure(DateTime date_start, DateTime date_end, int structure_id)
        {
            return await unitOfWork.ServiceRepository.DashboardGetCountLateBySelectedStructure(date_start, date_end, structure_id);
        }
        public async Task<List<ChartTableDataDashboardStructure>> DashboardGetCountLateByStructure(DateTime date_start, DateTime date_end)
        {
            return await unitOfWork.ServiceRepository.DashboardGetCountLateByStructure(date_start, date_end);
        }
        public async Task<List<ChartTableDataDashboardStructure>> DashboardGetRefucalCountByStructure(DateTime date_start, DateTime date_end)
        {
            return await unitOfWork.ServiceRepository.DashboardGetRefucalCountByStructure(date_start, date_end);
        }
        public async Task<List<ChartTableDataDashboard>> DashboardGetEmployeesToDutyPlan(DateTime date_start, DateTime date_end)
        {
            return await unitOfWork.ServiceRepository.DashboardGetEmployeesToDutyPlan(date_start, date_end);
        }
        public async Task<List<ChartTableDataDashboard>> DashboardGetAppsFromRegister(DateTime date_start, DateTime date_end)
        {
            return await unitOfWork.ServiceRepository.DashboardGetAppsFromRegister(date_start, date_end);
        }

        public async Task<AppCountDashboradData> GetAppCountDashboardByStructure(DateTime date_start, DateTime date_end, int structure_id)
        {
            return await unitOfWork.ServiceRepository.GetAppCountDashboardByStructure(date_start, date_end, structure_id);
        }

        public async Task<object> GetApplicationsCategoryCount(DateTime date_start, DateTime date_end, int? district_id, bool? is_paid)
        {
            return await unitOfWork.ServiceRepository.GetApplicationsCategoryCount(date_start, date_end, district_id, is_paid);
        }

        public async Task<object> GetApplicationsCategoryCountForMyStructure(DateTime date_start, DateTime date_end, int? district_id, bool? is_paid)
        {
            var user_id = await unitOfWork.UserRepository.GetUserUID();

            var services = await unitOfWork.ServiceRepository.GetMyStructure(user_id);

            if (user_id == "2137758e-0770-4e2a-84a2-17b3048f3a48" || user_id == "fc14bd43-a852-4769-b48c-6e0df71b4c1c" || user_id == "9d253aff-9d91-4b9d-991b-ea415a7a3762" || user_id == "df0f1708-dc6d-433a-af54-999b6fcdd367")
            {
                var all = await unitOfWork.ServiceRepository.GetAll();
                services = all.Where(x => x.name != null && x.name.StartsWith("РА")).ToList();
            }

            return await unitOfWork.ServiceRepository.GetApplicationsCategoryCountForMyStructure(date_start, date_end, district_id, is_paid, user_id, services.Select(x => x.id).ToList());
        }
        
        public async Task<object> GetApplicationsCountForMyStructure(DateTime? startDate, DateTime? endDate)
        {
            var user_id = await unitOfWork.UserRepository.GetUserUID();

            var structures = await unitOfWork.OrgStructureRepository.GetByUserId(user_id);
            
            return await unitOfWork.ServiceRepository.GetApplicationsCountForMyStructure(startDate, endDate, user_id, structures.Select(x => x.id).ToList());
        }

        public async Task<ResultDashboard> DashboardGetCountObjectsMyStructure(int district_id)
        {
            var user_id = await unitOfWork.UserRepository.GetUserUID();
            return await unitOfWork.ServiceRepository.DashboardGetCountObjectsMyStructure(district_id, user_id);
        }
    }
}
