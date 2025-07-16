using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DiscountDocumentTypeController : ControllerBase
    {
        private readonly DiscountDocumentTypeUseCases _DiscountDocumentTypeUseCases;

        public DiscountDocumentTypeController(DiscountDocumentTypeUseCases DiscountDocumentTypeUseCases)
        {
            _DiscountDocumentTypeUseCases = DiscountDocumentTypeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _DiscountDocumentTypeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _DiscountDocumentTypeUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _DiscountDocumentTypeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateDiscountDocumentTypeRequest requestDto)
        {
            var request = new Domain.Entities.DiscountDocumentType
            {
                name = requestDto.name,
                code = requestDto.code,
                description = requestDto.description,
            };
            var response = await _DiscountDocumentTypeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateDiscountDocumentTypeRequest requestDto)
        {
            var request = new Domain.Entities.DiscountDocumentType
            {
                id = requestDto.id,
                name = requestDto.name,
                code = requestDto.code,
                description = requestDto.description,
            };
            var response = await _DiscountDocumentTypeUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _DiscountDocumentTypeUseCases.Delete(id);
            return Ok();
        }
    }
}