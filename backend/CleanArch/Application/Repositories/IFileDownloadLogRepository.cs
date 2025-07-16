using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface IFileDownloadLogRepository: BaseRepository
    {
        Task Add(int userId, string username, int fileId, string fileName);
        Task<List<FileDownloadLog>> GetAll();
    }
}
