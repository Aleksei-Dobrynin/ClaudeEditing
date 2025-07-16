using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class step_required_documentController : ControllerBase
    {
        private readonly step_required_documentUseCases _step_required_documentUseCases;

        public step_required_documentController(step_required_documentUseCases step_required_documentUseCases)
        {
            _step_required_documentUseCases = step_required_documentUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _step_required_documentUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _step_required_documentUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createstep_required_documentRequest requestDto)
        {
            var request = new Domain.Entities.step_required_document
            {
                
                step_id = requestDto.step_id,
                document_type_id = requestDto.document_type_id,
                is_required = requestDto.is_required,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by
            };
            var response = await _step_required_documentUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatestep_required_documentRequest requestDto)
        {
            var request = new Domain.Entities.step_required_document
            {
                id = requestDto.id,
                
                step_id = requestDto.step_id,
                document_type_id = requestDto.document_type_id,
                is_required = requestDto.is_required,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                updated_by = requestDto.updated_by,
                created_by = requestDto.created_by

            };
            var response = await _step_required_documentUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _step_required_documentUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _step_required_documentUseCases.GetOne(id);
            return Ok(response);
        }


        [HttpGet]
        [Route("GetByPathId")]
        public async Task<IActionResult> GetByPathId(int pathId)
        {
            var response = await _step_required_documentUseCases.GetByPathId(pathId);
            return Ok(response);
        }


        [HttpGet]
        [Route("GetBystep_id")]
        public async Task<IActionResult> GetBystep_id(int step_id)
        {
            var response = await _step_required_documentUseCases.GetBystep_id(step_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetBydocument_type_id")]
        public async Task<IActionResult> GetBydocument_type_id(int document_type_id)
        {
            var response = await _step_required_documentUseCases.GetBydocument_type_id(document_type_id);
            return Ok(response);
        }
        

    }
}
