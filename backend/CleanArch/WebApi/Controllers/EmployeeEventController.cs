using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeeEventController : ControllerBase
    {
        private readonly EmployeeEventUseCases _employeeEventUseCases;

        public EmployeeEventController(EmployeeEventUseCases employeeEventUseCases)
        {
            _employeeEventUseCases = employeeEventUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _employeeEventUseCases.GetAll();
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByIDEmployee")]
        public async Task<IActionResult> GetByIDEmployee(int idEmployee)
        {
            var response = await _employeeEventUseCases.GetByIDEmployee(idEmployee);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _employeeEventUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _employeeEventUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateEmployeeEventRequest requestDto)
        {
            var request = new Domain.Entities.EmployeeEvent
            {
                date_start = requestDto.date_start,
                date_end = requestDto.date_end,
                event_type_id = requestDto.event_type_id,
                employee_id = requestDto.employee_id,
                temporary_employee_id = requestDto.temporary_employee_id
            };
            var response = await _employeeEventUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateEmployeeEventRequest requestDto)
        {
            var request = new Domain.Entities.EmployeeEvent
            {
                id = requestDto.id,
                date_start = requestDto.date_start,
                date_end = requestDto.date_end,
                event_type_id = requestDto.event_type_id,
                employee_id = requestDto.employee_id,
                temporary_employee_id = requestDto.temporary_employee_id
            };
            var response = await _employeeEventUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _employeeEventUseCases.Delete(id);
            return Ok();
        }
    }
}
