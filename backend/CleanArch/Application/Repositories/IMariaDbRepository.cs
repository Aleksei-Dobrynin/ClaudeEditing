using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IMariaDbRepository
    {
        Task<int> Add(Domain.Entities.Statement domain);
        Task<int> AddReestr(Domain.Entities.Reestr domain);
        Task<int> UpdateReestr(Domain.Entities.Reestr domain);
        Task Update(Domain.Entities.Statement domain);
        Task UpdateWorkers(Domain.Entities.Statement domain);
        Task<List<UserMariaDb>> GetEmployeesByEmail(string email);
        Task<Statement> GetLastAddedApplication();
        Task<Statement> GetStatementById(int id);
        Task ChangeStepApplication(int statement_id, int step_id);
        bool HasMariaDbConnection();
        Task SyncPayment(string number, int structure_id, UserMariaDb user, List<application_payment> payments, application_payment payment);
        Task SyncPaymentUpdate(string number, int structure_id, UserMariaDb user, List<application_payment> payments, application_payment payment);
        Task SyncPaymentDelete(string number, int structure_id, UserMariaDb user, List<application_payment> payments);
        Task UpdateCost(int statement, double cost);
        Task UpdateCustomer(int statement, string name);
        Task<int> AddAppInReestr(Domain.Entities.ReestrInApp domain);
        Task<int> DeleteAppInReestr(int sid);
        Dictionary<int, int> MapOtdel();
        Task<int> AddPaymentInReestr(Domain.Entities.PaymentInReestr domain);
        Task<int> DeletePayInReestr(int sid);
    }
}
