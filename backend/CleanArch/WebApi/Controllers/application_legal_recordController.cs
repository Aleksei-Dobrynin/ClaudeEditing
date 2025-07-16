using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class application_legal_recordController : ControllerBase
    {
        private readonly application_legal_recordUseCases _application_legal_recordUseCases;

        public application_legal_recordController(application_legal_recordUseCases application_legal_recordUseCases)
        {
            _application_legal_recordUseCases = application_legal_recordUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _application_legal_recordUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _application_legal_recordUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createapplication_legal_recordRequest requestDto)
        {
            var request = new Domain.Entities.application_legal_record
            {
                
                id_application = requestDto.id_application,
                id_legalrecord = requestDto.id_legalrecord,
                id_legalact = requestDto.id_legalact,
                //created_at = requestDto.created_at,
                //updated_at = requestDto.updated_at,
                //created_by = requestDto.created_by,
                //updated_by = requestDto.updated_by,
            };
            var response = await _application_legal_recordUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateapplication_legal_recordRequest requestDto)
        {
            var request = new Domain.Entities.application_legal_record
            {
                id = requestDto.id,
                
                id_application = requestDto.id_application,
                id_legalrecord = requestDto.id_legalrecord,
                id_legalact = requestDto.id_legalact,
                //created_at = requestDto.created_at,
                //updated_at = requestDto.updated_at,
                //created_by = requestDto.created_by,
                //updated_by = requestDto.updated_by,
            };
            var response = await _application_legal_recordUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _application_legal_recordUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _application_legal_recordUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByid_application")]
        public async Task<IActionResult> GetByid_application(int id_application)
        {
            var response = await _application_legal_recordUseCases.GetByid_application(id_application);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByid_legalrecord")]
        public async Task<IActionResult> GetByid_legalrecord(int id_legalrecord)
        {
            var response = await _application_legal_recordUseCases.GetByid_legalrecord(id_legalrecord);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByid_legalact")]
        public async Task<IActionResult> GetByid_legalact(int id_legalact)
        {
            var response = await _application_legal_recordUseCases.GetByid_legalact(id_legalact);
            return Ok(response);
        }
        

    }
}
