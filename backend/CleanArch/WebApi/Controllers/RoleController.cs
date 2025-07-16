using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RoleController : ControllerBase
    {
        private readonly RoleUseCases _roleUseCases;

        public RoleController(RoleUseCases roleUseCases)
        {
            _roleUseCases = roleUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _roleUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _roleUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _roleUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateRoleRequest requestDto)
        {
            var request = new Domain.Entities.Role
            {
                name = requestDto.name,
                code = requestDto.code,
            };
            var response = await _roleUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateRoleRequest requestDto)
        {
            var request = new Domain.Entities.Role
            {
                id = requestDto.id,
                name = requestDto.name,
                code = requestDto.code,
            };
            var response = await _roleUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _roleUseCases.Delete(id);
            return Ok();
        }
    }
}
