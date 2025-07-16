using Application.Repositories;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UseCases
{
    public class CountryUseCases
    {
        private readonly IUnitOfWork unitOfWork;

        public CountryUseCases(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        public Task<List<Country>> GetAll()
        {
            return unitOfWork.countryRepository.GetAll();
        }

        public Task<Country> GetOne(int id)
        {
            return unitOfWork.countryRepository.GetOne(id);
        }
    }
}
