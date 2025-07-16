using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StructureTemplatesController : ControllerBase
    {
        private readonly StructureTemplatesUseCases _StructureTemplatesUseCases;

        public StructureTemplatesController(StructureTemplatesUseCases StructureTemplatesUseCases)
        {
            _StructureTemplatesUseCases = StructureTemplatesUseCases;
        }

        [HttpGet]
        [Route("GetAllForStructure")]
        public async Task<IActionResult> GetAllForStructure(int structure_id)
        {
            var response = await _StructureTemplatesUseCases.GetAllForStructure(structure_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _StructureTemplatesUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _StructureTemplatesUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateStructureTemplatesRequest requestDto)
        {
            var request = new Domain.Entities.StructureTemplates
            {
               name = requestDto.name,
               description = requestDto.description,
               translations = requestDto.translations,
               structure_id = requestDto.structure_id,
            };
            var response = await _StructureTemplatesUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateStructureTemplatesRequest requestDto)
        {
            var request = new Domain.Entities.StructureTemplates
            {
                id = requestDto.id,
                name = requestDto.name,
                description = requestDto.description,
                translations = requestDto.translations,
                structure_id = requestDto.structure_id,
                template_id = requestDto.template_id,
            };
            var response = await _StructureTemplatesUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _StructureTemplatesUseCases.Delete(id);
            return Ok();
        }
    }
}
