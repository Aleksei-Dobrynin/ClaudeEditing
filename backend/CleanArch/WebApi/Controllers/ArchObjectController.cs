using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ArchObjectController : ControllerBase
    {
        private readonly ArchObjectUseCases _districtUseCases;

        public ArchObjectController(ArchObjectUseCases districtUseCases)
        {
            _districtUseCases = districtUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _districtUseCases.GetAll();
            return Ok(response);
        }
        [HttpGet]
        [Route("GetByAppIdApplication")]
        public async Task<IActionResult> GetByAppIdApplication(int application_id)
        {
            var response = await _districtUseCases.GetByAppIdApplication(application_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetBySearch")]
        public async Task<IActionResult> GetBySearch(string? text)
        {
            var response = await _districtUseCases.GetBySearch(text);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _districtUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _districtUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateArchObjectRequest requestDto)
        {
            var request = new Domain.Entities.ArchObject
            {
                address = requestDto.address,
                name = requestDto.name,
                identifier = requestDto.identifier,
                district_id = requestDto.district_id,
                description = requestDto.description,
                tags = requestDto.tags,
                xcoordinate = requestDto.xcoordinate,
                ycoordinate = requestDto.ycoordinate,
            };
            var response = await _districtUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateArchObjectRequest requestDto)
        {
            var request = new Domain.Entities.ArchObject
            {
                id = requestDto.id,
                address = requestDto.address,
                name = requestDto.name,
                identifier = requestDto.identifier,
                district_id = requestDto.district_id,
                description = requestDto.description,
                tags = requestDto.tags,
                xcoordinate = requestDto.xcoordinate,
                ycoordinate = requestDto.ycoordinate,
            };
            var response = await _districtUseCases.Update(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("UpdateCoords")]
        public async Task<IActionResult> UpdateCoords(Domain.Entities.UpdateCoordsObjRequest requestDto)
        {
            await _districtUseCases.UpdateCoords(requestDto);
            return Ok();
        }
        
        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _districtUseCases.Delete(id);
            return Ok();
        }
        
        [HttpGet]
        [AllowAnonymous]
        [Route("GenerateNumber")]
        public IActionResult GenerateNumber(int app_id)
        {
            var number = _districtUseCases.GenerateNumber(app_id);
            return Ok(new { number = number });
        }
    }
}
