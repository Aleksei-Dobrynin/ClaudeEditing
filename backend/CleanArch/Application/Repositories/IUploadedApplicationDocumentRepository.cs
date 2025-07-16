using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Repositories
{
    public interface IUploadedApplicationDocumentRepository : BaseRepository
    {
        Task<List<UploadedApplicationDocument>> GetAll();
        Task<List<UploadedApplicationDocumentToCabinet>> GetUpoadsToCabinetById(int app_id);
        Task<UploadedApplicationDocument> GetOneByID(int id);
    }
}
