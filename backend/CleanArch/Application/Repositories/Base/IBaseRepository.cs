using System.Data;

namespace Application.Repositories
{
    public interface BaseRepository
    {
        void SetTransaction(IDbTransaction dbTransaction);
    }
}
