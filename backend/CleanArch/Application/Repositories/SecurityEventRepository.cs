using Application.Models;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface ISecurityEventRepository : BaseRepository
    {
        Task<int> Add(SecurityEvent securityEvent);
        Task<SecurityEvent> GetById(int id);
        Task<List<SecurityEvent>> GetByUserId(string userId);
        Task<List<SecurityEvent>> GetByEventType(string eventType);
        Task<List<SecurityEvent>> GetByDateRange(DateTime startDate, DateTime endDate);
        Task<PaginatedList<SecurityEvent>> GetPaginated(int pageSize, int pageNumber, string orderBy = "event_time", string orderType = "desc");
        Task<List<SecurityEvent>> GetUnresolvedEvents();
        Task UpdateResolution(int id, string resolutionNotes);
    }
}