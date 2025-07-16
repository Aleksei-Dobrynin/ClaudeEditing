using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class org_structure_templatesController : ControllerBase
    {
        private readonly org_structure_templatesUseCases _org_structure_templatesUseCases;

        public org_structure_templatesController(org_structure_templatesUseCases org_structure_templatesUseCases)
        {
            _org_structure_templatesUseCases = org_structure_templatesUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _org_structure_templatesUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _org_structure_templatesUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createorg_structure_templatesRequest requestDto)
        {
            var request = new Domain.Entities.org_structure_templates
            {
                
                structure_id = requestDto.structure_id,
                template_id = requestDto.template_id,
            };
            var response = await _org_structure_templatesUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateorg_structure_templatesRequest requestDto)
        {
            var request = new Domain.Entities.org_structure_templates
            {
                id = requestDto.id,
                
                structure_id = requestDto.structure_id,
                template_id = requestDto.template_id,
            };
            var response = await _org_structure_templatesUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _org_structure_templatesUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _org_structure_templatesUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetBystructure_id")]
        public async Task<IActionResult> GetBystructure_id(int structure_id)
        {
            var response = await _org_structure_templatesUseCases.GetBystructure_id(structure_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetBytemplate_id")]
        public async Task<IActionResult> GetBytemplate_id(int template_id)
        {
            var response = await _org_structure_templatesUseCases.GetBytemplate_id(template_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetMyTemplates")]
        public async Task<IActionResult> GetMyTemplates()
        {
            var response = await _org_structure_templatesUseCases.GetMyTemplates();
            return Ok(response);
        }
        

    }
}
