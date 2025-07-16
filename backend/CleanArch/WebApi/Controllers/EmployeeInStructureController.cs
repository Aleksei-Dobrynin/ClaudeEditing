using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeeInStructureController : ControllerBase
    {
        private readonly EmployeeInStructureUseCases _employeeInStructureUseCases;

        public EmployeeInStructureController(EmployeeInStructureUseCases employeeInStructureUseCases)
        {
            _employeeInStructureUseCases = employeeInStructureUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _employeeInStructureUseCases.GetAll();
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetInMyStructure")]
        public async Task<IActionResult> GetInMyStructure()
        {
            var response = await _employeeInStructureUseCases.GetInMyStructure();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetInMyStructureHistory")]
        public async Task<IActionResult> GetInMyStructureHistory()
        {
            var response = await _employeeInStructureUseCases.GetInMyStructureHistory();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetMyCurrentStructure")]
        public async Task<int> GetMyCurrentStructure()
        {
            var res = await _employeeInStructureUseCases.GetMyCurrentStructure();
            return res;
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _employeeInStructureUseCases.GetOneByID(id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByidStructure")]
        public async Task<IActionResult> GetByidStructure(int idStructure)
        {
            var response = await _employeeInStructureUseCases.GetByidStructure(idStructure);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByidEmployee")]
        public async Task<IActionResult> GetByidEmployee(int idEmployee)
        {
            var response = await _employeeInStructureUseCases.GetByidEmployee(idEmployee);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByEmployeeStructureId")]
        public async Task<IActionResult> GetByEmployeeStructureId(int idStructure)
        {
            var response = await _employeeInStructureUseCases.GetByEmployeeStructureId(idStructure);
            return Ok(response);
        }


        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _employeeInStructureUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateEmployeeInStructureRequest requestDto)
        {
            var request = new Domain.Entities.EmployeeInStructure
            {
                employee_id = requestDto.employee_id,
                date_start = requestDto.date_start,
                date_end = requestDto.date_end,
                structure_id = requestDto.structure_id,
                is_temporary = requestDto.is_temporary,
                post_id = requestDto.post_id,
            };
            var response = await _employeeInStructureUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateEmployeeInStructureRequest requestDto)
        {
            var request = new Domain.Entities.EmployeeInStructure
            {
                id = requestDto.id,
                employee_id = requestDto.employee_id,
                date_start = requestDto.date_start,
                date_end = requestDto.date_end,
                is_temporary = requestDto.is_temporary,
                structure_id = requestDto.structure_id,
                post_id = requestDto.post_id,
            };
            var response = await _employeeInStructureUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _employeeInStructureUseCases.Delete(id);
            return Ok();
        }
        [HttpPost]
        [Route("FireEmployee")]
        public async Task<IActionResult> FireEmployee(int id)
        {
            await _employeeInStructureUseCases.FireEmployee(id);
            return Ok();
        }
        [HttpGet]
        [Route("CheckIsHeadStructure")]
        public async Task<IActionResult> CheckIsHeadStructure(int employee_id)
        {
            return Ok(await _employeeInStructureUseCases.CheckIsHeadStructure(employee_id));
        }
        
    }
}
