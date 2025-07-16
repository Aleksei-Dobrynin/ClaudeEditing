using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class document_approverController : ControllerBase
    {
        private readonly document_approverUseCases _document_approverUseCases;

        public document_approverController(document_approverUseCases document_approverUseCases)
        {
            _document_approverUseCases = document_approverUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _document_approverUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _document_approverUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createdocument_approverRequest requestDto)
        {
            var request = new Domain.Entities.document_approver
            {
                
                step_doc_id = requestDto.step_doc_id,
                department_id = requestDto.department_id,
                position_id = requestDto.position_id,
                is_required = requestDto.is_required,
                approval_order = requestDto.approval_order,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by
            };
            var response = await _document_approverUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatedocument_approverRequest requestDto)
        {
            var request = new Domain.Entities.document_approver
            {
                id = requestDto.id,
                
                step_doc_id = requestDto.step_doc_id,
                department_id = requestDto.department_id,
                position_id = requestDto.position_id,
                is_required = requestDto.is_required,
                approval_order = requestDto.approval_order,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by
            };
            var response = await _document_approverUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _document_approverUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _document_approverUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetBystep_doc_id")]
        public async Task<IActionResult> GetBystep_doc_id(int step_doc_id)
        {
            var response = await _document_approverUseCases.GetBystep_doc_id(step_doc_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetBydepartment_id")]
        public async Task<IActionResult> GetBydepartment_id(int department_id)
        {
            var response = await _document_approverUseCases.GetBydepartment_id(department_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByposition_id")]
        public async Task<IActionResult> GetByposition_id(int position_id)
        {
            var response = await _document_approverUseCases.GetByposition_id(position_id);
            return Ok(response);
        }
          
        [HttpGet]
        [Route("GetByPathId")]
        public async Task<IActionResult> GetByPathId(int pathId)
        {
            var response = await _document_approverUseCases.GetByPathId(pathId);
            return Ok(response);
        }
        

    }
}
