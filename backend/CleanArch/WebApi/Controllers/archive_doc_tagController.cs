using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class archive_doc_tagController : ControllerBase
    {
        private readonly archive_doc_tagUseCases _archive_doc_tagUseCases;

        public archive_doc_tagController(archive_doc_tagUseCases archive_doc_tagUseCases)
        {
            _archive_doc_tagUseCases = archive_doc_tagUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _archive_doc_tagUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _archive_doc_tagUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createarchive_doc_tagRequest requestDto)
        {
            var request = new Domain.Entities.archive_doc_tag
            {
                
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                name_kg = requestDto.name_kg,
                description_kg = requestDto.description_kg,
                text_color = requestDto.text_color,
                background_color = requestDto.background_color,
                created_at = requestDto.created_at,
            };
            var response = await _archive_doc_tagUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatearchive_doc_tagRequest requestDto)
        {
            var request = new Domain.Entities.archive_doc_tag
            {
                id = requestDto.id,
                
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                name_kg = requestDto.name_kg,
                description_kg = requestDto.description_kg,
                text_color = requestDto.text_color,
                background_color = requestDto.background_color,
                created_at = requestDto.created_at,
            };
            var response = await _archive_doc_tagUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _archive_doc_tagUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _archive_doc_tagUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
