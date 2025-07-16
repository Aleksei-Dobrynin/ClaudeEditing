using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MapController : ControllerBase
    {
        private readonly MapUseCases _mapUseCases;

        public MapController(MapUseCases mapUseCases)
        {
            _mapUseCases = mapUseCases;
        }

        [HttpGet]
        [Route("SearchAddressesByProp")]
        public async Task<IActionResult> SearchAddressesByProp(string propcode)
        {
            var response = await _mapUseCases.SearchAddressesByProp(propcode);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("SearchPropCodes")]
        public async Task<IActionResult> SearchPropCodes(string propcode)
        {
            var response = await _mapUseCases.SearchPropCodes(propcode);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetFlats")]
        public async Task<IActionResult> GetFlats(string propcode)
        {
            var response = await _mapUseCases.GetFlats(propcode);
            return Ok(response);
        }
    }
}
