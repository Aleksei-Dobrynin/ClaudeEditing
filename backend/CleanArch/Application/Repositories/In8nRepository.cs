using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface In8nRepository
    {
        Task<List<n8nResponse>> Get(int application_id, string url);
        void Run(int application_id, string url);
    }
}
