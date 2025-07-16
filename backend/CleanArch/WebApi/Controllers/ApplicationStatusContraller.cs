using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApplicationStatusController : ControllerBase
    {
        private readonly ApplicationStatusUseCases _ApplicationStatus;

        public ApplicationStatusController(ApplicationStatusUseCases ApplicationStatus)
        {
            _ApplicationStatus = ApplicationStatus;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _ApplicationStatus.GetAll();
            return Ok(response);
        }
    }
}
