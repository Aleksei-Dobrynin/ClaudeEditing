using Application.Models;
using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases
{
    public class MapUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public MapUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<object> SearchAddressesByProp(string propcode)
        {
            return unitOfWork.MapRepository.SearchAddressesByProp(propcode);
        }
        
        public Task<List<AddressInfo>> SearchPropCodes(string propcode)
        {
            return unitOfWork.MapRepository.SearchPropCodes(propcode);
        }
        
        public Task<List<AddressInfo>> GetFlats(string propcode)
        {
            return unitOfWork.MapRepository.GetFlats(propcode);
        }
    }
}
