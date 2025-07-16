using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApplicationStatusHistoryController : ControllerBase
    {
        private readonly ApplicationStatusHistoryUseCases _ApplicationStatusHistory;

        public ApplicationStatusHistoryController(ApplicationStatusHistoryUseCases ApplicationStatusHistory)
        {
            _ApplicationStatusHistory = ApplicationStatusHistory;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _ApplicationStatusHistory.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByApplication")]
        public async Task<IActionResult> GetByApplicationId(int application_id)
        {
            var response = await _ApplicationStatusHistory.GetByApplicationId(application_id);
            return Ok(response);
        }
    }
}
