using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class structure_application_logController : ControllerBase
    {
        private readonly structure_application_logUseCases _structure_application_logUseCases;

        public structure_application_logController(structure_application_logUseCases structure_application_logUseCases)
        {
            _structure_application_logUseCases = structure_application_logUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _structure_application_logUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetAllMyStructure")]
        public async Task<IActionResult> GetAllMyStructure()
        {
            var response = await _structure_application_logUseCases.GetAllMyStructure();
            return Ok(response);
        }

        [HttpGet]
        [Route("ChangeStatus")]
        public async Task<IActionResult> ChangeStatus(string status, int id)
        {
            var response = await _structure_application_logUseCases.ChangeStatus(id, status);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _structure_application_logUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createstructure_application_logRequest requestDto)
        {
            var request = new Domain.Entities.structure_application_log
            {
                
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                updated_at = requestDto.updated_at,
                created_at = requestDto.created_at,
                structure_id = requestDto.structure_id,
                application_id = requestDto.application_id,
                status = requestDto.status,
                status_code = requestDto.status_code,
            };
            var response = await _structure_application_logUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatestructure_application_logRequest requestDto)
        {
            var request = new Domain.Entities.structure_application_log
            {
                id = requestDto.id,
                
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                updated_at = requestDto.updated_at,
                created_at = requestDto.created_at,
                structure_id = requestDto.structure_id,
                application_id = requestDto.application_id,
                status = requestDto.status,
                status_code = requestDto.status_code,
            };
            var response = await _structure_application_logUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _structure_application_logUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _structure_application_logUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
