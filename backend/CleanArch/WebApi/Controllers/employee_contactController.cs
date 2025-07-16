using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class employee_contactController : ControllerBase
    {
        private readonly employee_contactUseCases _employee_contactUseCases;

        public employee_contactController(employee_contactUseCases employee_contactUseCases)
        {
            _employee_contactUseCases = employee_contactUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _employee_contactUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByIDEmployee")]
        public async Task<IActionResult> GetByIDEmployee(int idEmployee)
        {
            var response = await _employee_contactUseCases.GetByIDEmployee(idEmployee);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _employee_contactUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createemployee_contactRequest requestDto)
        {
            var request = new Domain.Entities.employee_contact
            {

                value = requestDto.value,
                employee_id = requestDto.employee_id,
                type_id = requestDto.type_id,
                allow_notification = requestDto.allow_notification,
            };
            var response = await _employee_contactUseCases.Create(request);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("SetTelegramContact")]
        public async Task<IActionResult> SetTelegramContact(Domain.Entities.SetTelegramContact requestDto)
        {
            var response = await _employee_contactUseCases.SetTelegramContact(requestDto);
            return ActionResultHelper.FromResult(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateemployee_contactRequest requestDto)
        {
            var request = new Domain.Entities.employee_contact
            {
                id = requestDto.id,
                
                value = requestDto.value,
                employee_id = requestDto.employee_id,
                type_id = requestDto.type_id,
                allow_notification = requestDto.allow_notification,
            };
            var response = await _employee_contactUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _employee_contactUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _employee_contactUseCases.GetOne(id);
            return Ok(response);
        }



    }
}
