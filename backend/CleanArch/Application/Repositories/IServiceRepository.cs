using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IServiceRepository : BaseRepository
    {
        Task<List<Service>> GetAll();
        Task<List<Service>> GetMyStructure(string user_id);
        Task<Service> GetOneByID(int id);
        Task<PaginatedList<Service>> GetPaginated(int pageSize, int pageNumber);
        Task<int> Add(Service domain);
        Task Update(Service domain);
        Task Delete(int id);
        Task<ResultDashboard> DashboardGetCountServices(DateTime date_start, DateTime date_end, int structure_id);
        Task<ResultDashboard> DashboardGetAppsByStatusAndStructure(DateTime date_start, DateTime date_end, int structure_id, string status_name);
        Task<ResultDashboard> DashboardGetFinance(DateTime date_start, DateTime date_end, int structure_id);
        Task<ResultDashboard> DashboardGetPaymentFinance(DateTime date_start, DateTime date_end, int structure_id);

        Task<ResultDashboard> DashboardGetAppCount(DateTime date_start, DateTime date_end, int service_id, int status_id);
        Task<ResultDashboard> DashboardGetAppCount(DateTime date_start, DateTime date_end, int service_id, int status_id, string user_id);
        Task<ResultDashboard> GetForFinanceInvoice(DateTime date_start, DateTime date_end);
        Task<ResultDashboard> DashboardGetCountTasks(DateTime date_start, DateTime date_end, int structure_id);
        Task<ResultDashboard> DashboardGetCountUserApplications(DateTime date_start, DateTime date_end);
        Task<List<ArchObjectLeaflet>> GetApplicationsWithCoords(DateTime date_start, DateTime date_end, int service_id, string status_code, int tag_id);
        Task<List<ArchObjectLeaflet>> GetApplicationsWithCoords(DateTime date_start, DateTime date_end, int[] service_ids, string status_code, int[] tag_ids);
        Task<List<ArchObjectLeaflet>> GetApplicationsWithCoordsByStructures(DateTime date_start, DateTime date_end, int service_id, string status_code, int tag_id, List<int> structure_ids);
        Task<List<ArchObjectLeaflet>> GetApplicationsWithCoordsByStructures(DateTime date_start, DateTime date_end, int[] service_ids, string status_code, int[] tag_ids, List<int> structure_ids);
        Task<ResultDashboard> DashboardGetCountObjects(int district_id);
        Task<ResultDashboard> GetApplicationCountHour(DateTime date_start, DateTime date_end);
        Task<ResultDashboard> GetApplicationCountHour(DateTime date_start, DateTime date_end, string user_id);
        Task<ResultDashboard> GetApplicationCountWeek(DateTime date_start, DateTime date_end);
        Task<ResultDashboard> GetApplicationCountWeek(DateTime date_start, DateTime date_end, string user_id);
        Task<ResultDashboard> GetArchiveCount(DateTime date_start, DateTime date_end);
        Task<ResultDashboard> GetArchiveCount(DateTime date_start, DateTime date_end, string user_id);
        Task<List<ChartTableDataDashboard>> DashboardGetIssuedAppsRegister(DateTime date_start, DateTime date_end);
        Task<List<ChartTableDataDashboardStructure>> DashboardGetCountTaskByStructure(DateTime date_start, DateTime date_end);
        Task<List<ChartTableDataDashboardStructure>> DashboardGetCountBySelectedStructure(DateTime date_start, DateTime date_end, int structure_id);
        Task<List<ChartTableDataDashboardStructure>> DashboardGetRefucalCountBySelectedStructure(DateTime date_start, DateTime date_end, int structure_id);
        Task<List<ChartTableDataDashboardStructure>> DashboardGetRefucalCountByStructure(DateTime date_start, DateTime date_end);
        Task<List<ChartTableDataDashboardStructure>> DashboardGetCountLateByStructure(DateTime date_start, DateTime date_end);
        Task<List<ChartTableDataDashboardStructure>> DashboardGetCountLateBySelectedStructure(DateTime date_start, DateTime date_end, int structure_id);
        Task<List<ChartTableDataDashboard>> DashboardGetEmployeesToDutyPlan(DateTime date_start, DateTime date_end);
        Task<List<ChartTableDataDashboard>> DashboardGetAppsFromRegister(DateTime date_start, DateTime date_end);
        Task<AppCountDashboradData> GetAppCountDashboardByStructure(DateTime date_start, DateTime date_end, int structure_id);
        Task<object> GetApplicationsCategoryCount(DateTime date_start, DateTime date_end, 
            int? district_id, bool? is_paid);
        Task<object> GetApplicationsCategoryCountForMyStructure(DateTime date_start, DateTime date_end, int? district_id, bool? is_paid, string user_id, List<int> ids);
        Task<ResultDashboard> DashboardGetCountObjectsMyStructure(int district_id, string user_id);
        Task<ResultDashboard> DashboardGetCountUserApplications(DateTime date_start, DateTime date_end, string user_id);
        Task<object> GetApplicationsCountForMyStructure(DateTime? date_start, DateTime? date_end, string user_id, List<int> ids);
    }
}
