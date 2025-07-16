using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DiscountDocumentsController : ControllerBase
    {
        private readonly DiscountDocumentsUseCases _DiscountDocumentsUseCases;

        public DiscountDocumentsController(DiscountDocumentsUseCases DiscountDocumentsUseCases)
        {
            _DiscountDocumentsUseCases = DiscountDocumentsUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _DiscountDocumentsUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _DiscountDocumentsUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _DiscountDocumentsUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create([FromForm] CreateDiscountDocumentsRequest requestDto)
        {
            var request = new Domain.Entities.DiscountDocuments
            {
                file_id = requestDto.file_id,
                description = requestDto.description,
                discount = requestDto.discount,
                discount_type_id = requestDto.discount_type_id,
                document_type_id = requestDto.document_type_id,
                start_date = requestDto.start_date,
                end_date = requestDto.end_date,
            };
            
            if (requestDto.document.file != null && requestDto.document.file.Length > 0)
            {
                byte[] fileBytes = null;
                if (requestDto.document.file.Length > 0)
                {
                    using var ms = new MemoryStream();
                    requestDto.document.file.CopyTo(ms);
                    fileBytes = ms.ToArray();
                }
                request.document = new Domain.Entities.File
                {
                    body = fileBytes,
                    name = requestDto.document.name,
                };
                var response = await _DiscountDocumentsUseCases.Create(request);
                return Ok(response);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update([FromForm] UpdateDiscountDocumentsRequest requestDto)
        {
            var request = new Domain.Entities.DiscountDocuments
            {
                file_id = requestDto.file_id,
                description = requestDto.description,
                discount = requestDto.discount,
                discount_type_id = requestDto.discount_type_id,
                document_type_id = requestDto.document_type_id,
                start_date = requestDto.start_date,
                end_date = requestDto.end_date,
            };
            
            if (requestDto.document.file != null && requestDto.document.file.Length > 0)
            {
                byte[] fileBytes = null;
                if (requestDto.document.file.Length > 0)
                {
                    using var ms = new MemoryStream();
                    requestDto.document.file.CopyTo(ms);
                    fileBytes = ms.ToArray();
                }
                request.document = new Domain.Entities.File
                {
                    body = fileBytes,
                    name = requestDto.document.name,
                };
            }
            var response = await _DiscountDocumentsUseCases.Update(request);
            return ActionResultHelper.FromResult(response);
        }
        
        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _DiscountDocumentsUseCases.Delete(id);
            return Ok();
        }
    }
}