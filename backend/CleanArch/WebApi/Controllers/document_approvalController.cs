using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class document_approvalController : ControllerBase
    {
        private readonly document_approvalUseCases _document_approvalUseCases;

        public document_approvalController(document_approvalUseCases document_approvalUseCases)
        {
            _document_approvalUseCases = document_approvalUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _document_approvalUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _document_approvalUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createdocument_approvalRequest requestDto)
        {
            var request = new Domain.Entities.document_approval
            {
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                app_document_id = requestDto.app_document_id,
                file_sign_id = requestDto.file_sign_id,
                department_id = requestDto.department_id,
                position_id = requestDto.position_id,
                status = requestDto.status,
                approval_date = requestDto.approval_date,
                comments = requestDto.comments,
                created_at = requestDto.created_at,
                app_step_id = requestDto.app_step_id,
                document_type_id = requestDto.document_type_id,
                is_final = requestDto.is_final,
                source_approver_id = requestDto.source_approver_id,
                is_manually_modified = requestDto.is_manually_modified,
                last_sync_at = requestDto.last_sync_at
            };
            var response = await _document_approvalUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatedocument_approvalRequest requestDto)
        {
            var request = new Domain.Entities.document_approval
            {
                id = requestDto.id,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                app_document_id = requestDto.app_document_id,
                file_sign_id = requestDto.file_sign_id,
                department_id = requestDto.department_id,
                position_id = requestDto.position_id,
                status = requestDto.status,
                approval_date = requestDto.approval_date,
                comments = requestDto.comments,
                created_at = requestDto.created_at,
                app_step_id = requestDto.app_step_id,
                document_type_id = requestDto.document_type_id,
                is_final = requestDto.is_final,
                source_approver_id = requestDto.source_approver_id,
                is_manually_modified = requestDto.is_manually_modified,
                last_sync_at = requestDto.last_sync_at
            };
            var response = await _document_approvalUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _document_approvalUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _document_approvalUseCases.GetOne(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByapp_document_id")]
        public async Task<IActionResult> GetByapp_document_id(int app_document_id)
        {
            var response = await _document_approvalUseCases.GetByapp_document_id(app_document_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByfile_sign_id")]
        public async Task<IActionResult> GetByfile_sign_id(int file_sign_id)
        {
            var response = await _document_approvalUseCases.GetByfile_sign_id(file_sign_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetBydepartment_id")]
        public async Task<IActionResult> GetBydepartment_id(int department_id)
        {
            var response = await _document_approvalUseCases.GetBydepartment_id(department_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByposition_id")]
        public async Task<IActionResult> GetByposition_id(int position_id)
        {
            var response = await _document_approvalUseCases.GetByposition_id(position_id);
            return Ok(response);
        }
    }
}