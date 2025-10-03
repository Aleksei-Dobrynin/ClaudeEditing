using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SmejPortalController : ControllerBase
    {
        private readonly SmejPortalUseCases _smejPortalUseCases;

        public SmejPortalController(SmejPortalUseCases SmejPortalUseCases)
        {
            _smejPortalUseCases = SmejPortalUseCases;
        }

        [HttpGet]
        [Route("GetAllOrganizationData")]
        public async Task<IActionResult> GetAllOrganizationData()
        {
            var response = await _smejPortalUseCases.GetAllOrganizationData();
            return Ok(response);
        }  
        
        [HttpGet]
        [Route("GetByApplicationNumberApprovalRequestData")]
        public async Task<IActionResult> GetByApplicationNumberApprovalRequestData(string number)
        {
            var response = await _smejPortalUseCases.GetByApplicationNumberApprovalRequestData(number);
            return Ok(response);
        }
    }
}
