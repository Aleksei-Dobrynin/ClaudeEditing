using Domain.Entities;
using FluentResults;

namespace Application.Repositories
{
    public interface ISmejPortalApiRepository
    {
        Task<Result<List<SmejPortalOrganization>>> GetAllOrganizationData();
        Task<Result<List<SmejPortalApprovalRequest>>> GetByApplicationNumberApprovalRequestData(string number);
    }
} 