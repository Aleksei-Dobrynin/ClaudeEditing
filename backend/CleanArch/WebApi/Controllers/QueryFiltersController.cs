using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class QueryFiltersController : ControllerBase
    {
        private readonly QueryFiltersUseCases _QueryFiltersUseCases;

        public QueryFiltersController(QueryFiltersUseCases QueryFiltersUseCases)
        {
            _QueryFiltersUseCases = QueryFiltersUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _QueryFiltersUseCases.GetAll();
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetAppTaskFilters")]
        public async Task<IActionResult> GetAppTaskFilters()
        {
            var response = await _QueryFiltersUseCases.GetByTargetTable("application_task");
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _QueryFiltersUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _QueryFiltersUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateQueryFiltersRequest requestDto)
        {
            var request = new Domain.Entities.QueryFilters
            {
               name = requestDto.name,
               name_kg = requestDto.name_kg,
               code = requestDto.code,
               description = requestDto.description,
               target_table = requestDto.target_table,
               query = requestDto.query
            };
            var response = await _QueryFiltersUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateQueryFiltersRequest requestDto)
        {
            var request = new Domain.Entities.QueryFilters
            {
               id = requestDto.id,
               name = requestDto.name,
               name_kg = requestDto.name_kg,
               code = requestDto.code,
               description = requestDto.description,
               target_table = requestDto.target_table,
               query = requestDto.query
            };
            var response = await _QueryFiltersUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _QueryFiltersUseCases.Delete(id);
            return Ok();
        }
    }
}
