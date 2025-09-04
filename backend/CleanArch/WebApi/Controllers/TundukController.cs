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
        
        [HttpGet]
        [Route("getDistricts")]
        public async Task<IActionResult> GetDistricts()
        {
            var response = await _tundukMinjustUseCase.GetDistricts();
            return Ok(response);
        }      
        
        [HttpGet]
        [Route("GetAteChildren")]
        public async Task<IActionResult> GetAteChildren(int ateId)
        {
            var response = await _tundukMinjustUseCase.GetAteChildren(ateId);
            return Ok(response);
        }        
        
        [HttpGet]
        [Route("GetAllStreets")]
        public async Task<IActionResult> GetAllStreets()
        {
            var response = await _tundukMinjustUseCase.GetAllStreets();
            return Ok(response);
        }            
        
        [HttpGet]
        [Route("GetOneStreet")]
        public async Task<IActionResult> GetOneStreet(int id)
        {
            var response = await _tundukMinjustUseCase.GetOneStreet(id);
            return Ok(response);
        }      
        
        [HttpGet]
        [Route("Search")]
        public async Task<IActionResult> Search(string text, int ateId)
        {
            var response = await _tundukMinjustUseCase.Search(text, ateId);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetAteStreets")]
        public async Task<IActionResult> GetAteStreets(int ateId)
        {
            var response = await _tundukMinjustUseCase.GetAteStreets(ateId);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("SearchAddress")]
        public async Task<IActionResult> SearchAddress(int streetId, string? building, string? apartment, string? uch)
        {
            var response = await _tundukMinjustUseCase.SearchAddress(streetId, building, apartment, uch);
            return Ok(response);
        }
    }
}
