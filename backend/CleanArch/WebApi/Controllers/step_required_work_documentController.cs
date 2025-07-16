using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class step_required_work_documentController : ControllerBase
    {
        private readonly step_required_work_documentUseCases _step_required_work_documentUseCases;

        public step_required_work_documentController(step_required_work_documentUseCases step_required_work_documentUseCases)
        {
            _step_required_work_documentUseCases = step_required_work_documentUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _step_required_work_documentUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _step_required_work_documentUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createstep_required_work_documentRequest requestDto)
        {
            var request = new Domain.Entities.step_required_work_document
            {
                
                step_id = requestDto.step_id,
                work_document_type_id = requestDto.work_document_type_id,
                is_required = requestDto.is_required,
                description = requestDto.description,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _step_required_work_documentUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatestep_required_work_documentRequest requestDto)
        {
            var request = new Domain.Entities.step_required_work_document
            {
                id = requestDto.id,
                
                step_id = requestDto.step_id,
                work_document_type_id = requestDto.work_document_type_id,
                is_required = requestDto.is_required,
                description = requestDto.description,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _step_required_work_documentUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _step_required_work_documentUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _step_required_work_documentUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetBystep_id")]
        public async Task<IActionResult> GetBystep_id(int step_id)
        {
            var response = await _step_required_work_documentUseCases.GetBystep_id(step_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetBywork_document_type_id")]
        public async Task<IActionResult> GetBywork_document_type_id(int work_document_type_id)
        {
            var response = await _step_required_work_documentUseCases.GetBywork_document_type_id(work_document_type_id);
            return Ok(response);
        }
        

    }
}
