using Application.UseCases;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CountryController: ControllerBase
    {
        private readonly CountryUseCases _countryUseCases;

        public CountryController(CountryUseCases countryUseCases)
        {
            _countryUseCases = countryUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _countryUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _countryUseCases.GetOne(id);
            return Ok(response);
        }
    }

}
