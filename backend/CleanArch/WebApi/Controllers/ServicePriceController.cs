using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Domain.Entities;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ServicePriceController : ControllerBase
    {
        private readonly ServicePriceUseCase _servicePriceUseCase;

        public ServicePriceController(ServicePriceUseCase servicePriceUseCase)
        {
            _servicePriceUseCase = servicePriceUseCase;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _servicePriceUseCase.GetAll();
            return Ok(response);
        }        
        
        [HttpGet]
        [Route("GetServiceAll")]
        public async Task<IActionResult> GetServiceAll()
        {
            var response = await _servicePriceUseCase.GetServiceAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _servicePriceUseCase.GetOneByID(id);
            return Ok(response);
        }   
        
        [HttpGet]
        [Route("GetByApplicationAndStructure")]
        public async Task<IActionResult> GetByApplicationAndStructure(int application_id, int structure_id)
        {
            var response = await _servicePriceUseCase.GetByApplicationAndStructure(application_id, structure_id);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateServicePriceRequest requestDto)
        {
            try
            {
                var request = new ServicePrice
                {
                    service_id = requestDto.service_id,
                    structure_id = requestDto.structure_id,
                    price = requestDto.price,
                };
                var response = await _servicePriceUseCase.Create(request);
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }

        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateServicePriceRequest requestDto)
        {
            var request = new ServicePrice
            {
                id = requestDto.id,
                service_id = requestDto.service_id,
                structure_id = requestDto.structure_id,
                price = requestDto.price,
            };
            await _servicePriceUseCase.Update(request);
            return Ok();
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _servicePriceUseCase.Delete(id);
            return Ok();
        }
    }
}
