namespace Application.UseCases;

public interface IApplicationUseCases
{
    Task<int> SaveDataFromClient(Domain.Entities.Application application);
    Task<int> SaveResendDataFromClient(Domain.Entities.Application application);
}