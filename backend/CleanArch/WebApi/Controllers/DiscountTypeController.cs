using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DiscountTypeController : ControllerBase
    {
        private readonly DiscountTypeUseCases _DiscountTypeUseCases;

        public DiscountTypeController(DiscountTypeUseCases DiscountTypeUseCases)
        {
            _DiscountTypeUseCases = DiscountTypeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _DiscountTypeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _DiscountTypeUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _DiscountTypeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateDiscountTypeRequest requestDto)
        {
            var request = new Domain.Entities.DiscountType
            {
               name = requestDto.name,
               code = requestDto.code,
               description = requestDto.description,
            };
            var response = await _DiscountTypeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateDiscountTypeRequest requestDto)
        {
            var request = new Domain.Entities.DiscountType
            {
               id = requestDto.id,
               name = requestDto.name,
               code = requestDto.code,
               description = requestDto.description,
            };
            var response = await _DiscountTypeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _DiscountTypeUseCases.Delete(id);
            return Ok();
        }
    }
}
