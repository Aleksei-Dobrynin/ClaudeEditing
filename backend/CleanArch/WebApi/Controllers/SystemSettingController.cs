using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SystemSettingController : ControllerBase
    {
        private readonly SystemSettingUseCases _SystemSettingUseCases;

        public SystemSettingController(SystemSettingUseCases SystemSettingUseCases)
        {
            _SystemSettingUseCases = SystemSettingUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _SystemSettingUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _SystemSettingUseCases.GetOneByID(id);
            return Ok(response);
        }
        
        [HttpGet("GetByCodes")]
        public async Task<IActionResult> GetByCodes(string codes)
        {
            var codeList = codes.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList();
            var response = await _SystemSettingUseCases.GetByCodes(codeList);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _SystemSettingUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateSystemSettingRequest requestDto)
        {
            var request = new Domain.Entities.SystemSetting
            {
               name = requestDto.name,
               description = requestDto.description,
               code = requestDto.code,
               value = requestDto.value
            };
            var response = await _SystemSettingUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateSystemSettingRequest requestDto)
        {
            var request = new Domain.Entities.SystemSetting
            {
               id = requestDto.id, 
               name = requestDto.name,
               description = requestDto.description,
               code = requestDto.code,
               value = requestDto.value,
            };
            var response = await _SystemSettingUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _SystemSettingUseCases.Delete(id);
            return Ok();
        }
    }
}
