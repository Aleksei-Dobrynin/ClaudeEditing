using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IApplicationRepository : BaseRepository
    {
        Task<List<Domain.Entities.Application>> GetAll();
        Task<List<Domain.Entities.Application>> GetMyArchiveApplications(string pin);
        Task<int> SetAppCabinetGuid(int id, string guid);
        Task<List<Domain.Entities.Application>> GetFromCabinet();
        Task<List<Domain.Entities.Application>> GetByFilterFromCabinet(PaginationFields model, bool onlyCount);
        Task<int> GetCountAppsFromCabinet();
        Task<List<Domain.Entities.ApplicationTask>> GetApplicationsByUserId(string userID, string searchField, string orderBy, string orderType, int skipItem, int getCountItems, string? queryFilter);
        Task<Domain.Entities.Application> GetOneByID(int id);
        Task<Domain.Entities.Application> GetOneByGuid(string guid);
        Task<Domain.Entities.Application> GetOneByNumber(string number);
        Task<PaginatedList<Domain.Entities.Application>> GetPaginated(PaginationFields model, bool onlyCount, bool skip);  
        Task<PaginatedList<Domain.Entities.Application>> GetPaginated2(PaginationFields model, bool onlyCount);  
        Task<PaginatedList<Domain.Entities.Application>> GetPaginatedDashboardIssuedFromRegister(PaginationFields model, bool onlyCount);  
        Task<int> GetFileId(int id);
        Task<int> GetLastNumber();
        Task<int> Add(Domain.Entities.Application domain);
        Task Update(Domain.Entities.Application domain);
        Task UpdateObjectTag(int application_id, int object_tag_id, int user_id);
        Task UpdatePaid(Domain.Entities.Application domain);
        Task UpdatePaidWithSum(int id, decimal sum);
        Task UpdateTechDecision(Domain.Entities.Application domain);
        Task<List<Domain.Entities.Application>> GetForReestrOtchet(int year, int month, string status, int structure_id);
        Task<List<Domain.Entities.Application>> GetForReestrRealization(int year, int month, string status, int[]? structure_ids);
        Task Delete(int id);
        Task<Domain.Entities.ApplicationStatus> GetStatusById(int id);
        Task<List<ApplicationPivot>> GetForPivotDashboard(DateTime date_start, DateTime date_end, int service_id, int status_id);
        Task<List<ApplicationPivot>> GetForPivotDashboard(DateTime date_start, DateTime date_end, int service_id, int status_id, string user_id);
        Task<List<Domain.Entities.ApplicationReport>> GetForReport(bool? isOrg, int? mount, int? year, int? structure);
        Task<PaginatedList<Domain.Entities.ApplicationReport>> GetForReportPaginated(bool? isOrg,int? mount,int? year,int? structure,int pageSize,int pageNumber,string orderBy,string? orderType);
        Task<int> sendDpOutgoingNumber(int application_id, string? dp_outgoing_number);
        Task<int> sendOutgoingNumber(int application_id, string? outgoing_number);
        Task<int> ChangeStatus(int application_id, int status_id);
        Task SaveMariaDbId(int application_id, int maria_db_statement_id);
        Task<ApplicationStatus> GetStatusByIdTask(int task_id);
        Task UpdateSum(ApplicationTotalSumData domain);
        Task<Domain.Entities.Application> GetOneApplicationSumByID(int id);
        Task<Domain.Entities.Application> GetForSaveApplicationTotalSum(int id);
        Task<Domain.Entities.Application> SaveApplicationTotalSum(Domain.Entities.Application request);
        Task<Domain.Entities.Application> GetOneByApplicationCode(string code);

        Task ChangeAllStatuses(int reestr_id, int status_id);
        Task<Domain.Entities.Application> CheckHasCreated(Domain.Entities.Application domain);

        Task SetHtmlFromCabinet(int applicationId, string html);
        Task<List<MyApplication>> GetMyApplication(string user_id);
        Task SetElectronicOnly(int application_id, bool is_electronic);
    }
}
