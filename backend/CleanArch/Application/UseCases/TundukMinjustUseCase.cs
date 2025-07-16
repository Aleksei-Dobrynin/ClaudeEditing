using Application.Repositories;
using Domain.Entities;

namespace Application.UseCases;

public class TundukMinjustUseCase 
{
    private readonly IMinjustRepository _minjustRepository;

    public TundukMinjustUseCase(IMinjustRepository minjustRepository)
    {
        _minjustRepository = minjustRepository;
    }

    public Task<Customer> GetInfoByPin(string pin)
    {
        return _minjustRepository.GetInfoByPin(pin);
    }
}