using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;
using static WebApi.Controllers.ApplicationController;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class architecture_processController : ControllerBase
    {
        private readonly architecture_processUseCases _architecture_processUseCases;

        public architecture_processController(architecture_processUseCases architecture_processUseCases)
        {
            _architecture_processUseCases = architecture_processUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _architecture_processUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetAllToArchive")]
        public async Task<IActionResult> GetAllToArchive()
        {
            var response = await _architecture_processUseCases.GetAllToArchive();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _architecture_processUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createarchitecture_processRequest requestDto)
        {
            var request = new Domain.Entities.architecture_process
            {
                
                status_id = requestDto.status_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _architecture_processUseCases.Create(request);
            return Ok(response);
        }
        [HttpPost]
        [Route("SendToDutyPlan")]
        public async Task<IActionResult> SendToDutyPlan(SendToDutyPlanRequest requestDto)
        {
            var response = await _architecture_processUseCases.SendToDutyPlan(requestDto.app_id, requestDto.dp_outgoing_number, requestDto.workDocs, requestDto.uplDocs);
            return Ok(response);
        }
        public class SendToDutyPlanRequest
        {
            public int app_id { get; set; }
            public string? dp_outgoing_number { get; set; }
            public List<int> workDocs { get; set; }
            public List<int> uplDocs { get; set; }

        }

        [HttpPost]
        [Route("ChangeStatus")]
        public async Task<IActionResult> ChangeStatus(ChangeStatusDto model)
        {
            var response = await _architecture_processUseCases.ChangeStatus(model.application_id, model.status_id);
            return ActionResultHelper.FromResult(response); ;
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatearchitecture_processRequest requestDto)
        {
            var request = new Domain.Entities.architecture_process
            {
                id = requestDto.id,
                
                status_id = requestDto.status_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _architecture_processUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _architecture_processUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _architecture_processUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetBystatus_id")]
        public async Task<IActionResult> GetBystatus_id(int status_id)
        {
            var response = await _architecture_processUseCases.GetBystatus_id(status_id);
            return Ok(response);
        }
        

    }
}
