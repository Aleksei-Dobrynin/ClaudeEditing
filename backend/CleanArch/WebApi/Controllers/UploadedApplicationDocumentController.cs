using Application.UseCases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UploadedApplicationDocumentController : ControllerBase
    {
        private readonly UploadedApplicationDocumentUseCases _uploadedApplicationDocumentUseCases;

        public UploadedApplicationDocumentController(UploadedApplicationDocumentUseCases uploadedApplicationDocumentUseCases)
        {
            _uploadedApplicationDocumentUseCases = uploadedApplicationDocumentUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _uploadedApplicationDocumentUseCases.GetAll();
            return Ok(response);
        }
    }
}
