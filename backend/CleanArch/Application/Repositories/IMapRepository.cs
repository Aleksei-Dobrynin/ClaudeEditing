using Application.Models;
using Domain.Entities;

namespace Application.Repositories
{
    public interface IMapRepository : BaseRepository
    {
        Task<object> SearchAddressesByProp(string propcode);
        Task<List<AddressInfo>> GetFlats(string propcode);
        Task<List<AddressInfo>> SearchPropCodes(string propcode);
    }
}