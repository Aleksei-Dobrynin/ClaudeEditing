using Application.UseCases;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TundukController : ControllerBase
    {
        private readonly TundukMinjustUseCase _tundukMinjustUseCase;
        
        public TundukController(TundukMinjustUseCase tundukMinjustUseCase)
        {
            _tundukMinjustUseCase = tundukMinjustUseCase;
        }
        
        [HttpGet]
        [Route("minjust/getInfoByPin")]
        public async Task<IActionResult> GetInfoByPin(string pin)
        {
            var response = await _tundukMinjustUseCase.GetInfoByPin(pin);
            return Ok(response);
        }
    }
}
