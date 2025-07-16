using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IFileRepository : BaseRepository
    {
        Task<List<Domain.Entities.File>> GetAll();
        Task<List<Domain.Entities.FileSign>> GetSignByFileIds(int[] ids);
        public Task<Domain.Entities.File> GetOne(int id);
        public Task<byte[]> GetByPath(string path);
        public Domain.Entities.File UpdateDocumentFilePath(Domain.Entities.File dto);
        public Task<int> Add(Domain.Entities.File dto);
        public Task<int> Update(Domain.Entities.File dto);
        Task<int> AddSign(Domain.Entities.FileSign dto);
        public Domain.Entities.File AddDocument(Domain.Entities.File dto);
        public Task<List<PaymentRecord>> ReadPaymentRecords(MemoryStream stream);
        public Task<List<PaymentRecordMbank>> ReadPaymentMbankRecords(MemoryStream stream);
        Task<int> AddHistoryLog(FileHistoryLog dto);
        public string GetFullPath(string path);
    }
}
