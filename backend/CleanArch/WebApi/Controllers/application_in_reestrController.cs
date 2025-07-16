using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class application_in_reestrController : ControllerBase
    {
        private readonly application_in_reestrUseCases _application_in_reestrUseCases;

        public application_in_reestrController(application_in_reestrUseCases application_in_reestrUseCases)
        {
            _application_in_reestrUseCases = application_in_reestrUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _application_in_reestrUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _application_in_reestrUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createapplication_in_reestrRequest requestDto)
        {
            var request = new Domain.Entities.application_in_reestr
            {

                reestr_id = requestDto.reestr_id,
                application_id = requestDto.application_id,
            };
            var response = await _application_in_reestrUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateapplication_in_reestrRequest requestDto)
        {
            var request = new Domain.Entities.application_in_reestr
            {
                id = requestDto.id,

                reestr_id = requestDto.reestr_id,
                application_id = requestDto.application_id,
            };
            var response = await _application_in_reestrUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _application_in_reestrUseCases.Delete(id);
            return Ok(response);
        }

        [HttpDelete]
        [Route("DeleteByAppId/{application_id:int}")]
        public async Task<IActionResult> DeleteByAppId(int application_id)
        {
            var response = await _application_in_reestrUseCases.DeleteByAppId(application_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _application_in_reestrUseCases.GetOne(id);
            return Ok(response);
        }


        [HttpGet]
        [Route("GetByreestr_id")]
        public async Task<IActionResult> GetByreestr_id(int reestr_id)
        {
            var response = await _application_in_reestrUseCases.GetByreestr_id(reestr_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOtchetData")]
        public async Task<IActionResult> GetOtchetData(int reestr_id)
        {
            var response = await _application_in_reestrUseCases.GetOtchetData(reestr_id, 0, 0, "");
            return Ok(response);
        }

        [HttpGet]
        [Route("GetSvodnaya")]
        public async Task<IActionResult> GetSvodnaya(int year, int month, string status)
        {
            var response = await _application_in_reestrUseCases.GetOtchetData(null, year, month, status);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetTaxReport")]
        public async Task<IActionResult> GetTaxReport(int year, int month, string status)
        {
            var response = await _application_in_reestrUseCases.GetTaxReport(year, month, status);
            return Ok(response);
        }


    }
}
