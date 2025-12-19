using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;
using System;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class document_approval_sync_logController : ControllerBase
    {
        private readonly document_approval_sync_logUseCases _document_approval_sync_logUseCases;

        public document_approval_sync_logController(document_approval_sync_logUseCases document_approval_sync_logUseCases)
        {
            _document_approval_sync_logUseCases = document_approval_sync_logUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _document_approval_sync_logUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _document_approval_sync_logUseCases.GetPaginated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createdocument_approval_sync_logRequest requestDto)
        {
            var request = new Domain.Entities.document_approval_sync_log
            {
                document_approval_id = requestDto.document_approval_id,
                old_department_id = requestDto.old_department_id,
                new_department_id = requestDto.new_department_id,
                old_position_id = requestDto.old_position_id,
                new_position_id = requestDto.new_position_id,
                sync_reason = requestDto.sync_reason,
                synced_at = requestDto.synced_at ?? DateTime.UtcNow,
                synced_by = requestDto.synced_by,
                operation_type = requestDto.operation_type
            };
            var response = await _document_approval_sync_logUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatedocument_approval_sync_logRequest requestDto)
        {
            var request = new Domain.Entities.document_approval_sync_log
            {
                id = requestDto.id,
                document_approval_id = requestDto.document_approval_id,
                old_department_id = requestDto.old_department_id,
                new_department_id = requestDto.new_department_id,
                old_position_id = requestDto.old_position_id,
                new_position_id = requestDto.new_position_id,
                sync_reason = requestDto.sync_reason,
                synced_at = requestDto.synced_at,
                synced_by = requestDto.synced_by,
                operation_type = requestDto.operation_type
            };
            var response = await _document_approval_sync_logUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _document_approval_sync_logUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _document_approval_sync_logUseCases.GetOne(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetBydocument_approval_id")]
        public async Task<IActionResult> GetBydocument_approval_id(int document_approval_id)
        {
            var response = await _document_approval_sync_logUseCases.GetBydocument_approval_id(document_approval_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetBysynced_by")]
        public async Task<IActionResult> GetBysynced_by(int synced_by)
        {
            var response = await _document_approval_sync_logUseCases.GetBysynced_by(synced_by);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetBysync_reason")]
        public async Task<IActionResult> GetBysync_reason(string sync_reason)
        {
            var response = await _document_approval_sync_logUseCases.GetBysync_reason(sync_reason);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByoperation_type")]
        public async Task<IActionResult> GetByoperation_type(string operation_type)
        {
            var response = await _document_approval_sync_logUseCases.GetByoperation_type(operation_type);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByDateRange")]
        public async Task<IActionResult> GetByDateRange(DateTime startDate, DateTime endDate)
        {
            var response = await _document_approval_sync_logUseCases.GetByDateRange(startDate, endDate);
            return Ok(response);
        }
    }
}