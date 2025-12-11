using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserRoleController : ControllerBase
    {
        private readonly UserRoleUseCases _userRoleUseCases;

        public UserRoleController(UserRoleUseCases userRoleUseCases)
        {
            _userRoleUseCases = userRoleUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _userRoleUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _userRoleUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _userRoleUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateUserRoleRequest requestDto)
        {
            var request = new Domain.Entities.UserRole
            {
                role_id = requestDto.role_id,
                structure_id = requestDto.structure_id,
                user_id = requestDto.user_id,
            };
            var response = await _userRoleUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateUserRoleRequest requestDto)
        {
            var request = new Domain.Entities.UserRole
            {
                id = requestDto.id,
                role_id = requestDto.role_id,
                structure_id = requestDto.structure_id,
                user_id = requestDto.user_id,
            };
            var response = await _userRoleUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _userRoleUseCases.Delete(id);
            return Ok();
        }
    }
}
