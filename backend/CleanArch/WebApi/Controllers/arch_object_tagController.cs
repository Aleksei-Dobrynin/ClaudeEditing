using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class arch_object_tagController : ControllerBase
    {
        private readonly arch_object_tagUseCases _arch_object_tagUseCases;

        public arch_object_tagController(arch_object_tagUseCases arch_object_tagUseCases)
        {
            _arch_object_tagUseCases = arch_object_tagUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _arch_object_tagUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByIDObject")]
        public async Task<IActionResult> GetByIDarch_object(int idObject)
        {
            var response = await _arch_object_tagUseCases.GetByIDarch_object(idObject);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByIDTag")]
        public async Task<IActionResult> GetByIDTag(int idTag)
        {
            var response = await _arch_object_tagUseCases.GetByIDTag(idTag);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _arch_object_tagUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createarch_object_tagRequest requestDto)
        {
            var request = new Domain.Entities.arch_object_tag
            {
                id_object = requestDto.id_object,
                id_tag = requestDto.id_tag,
            };
            var response = await _arch_object_tagUseCases.Create(request);
            return Ok(response);
        }
        [HttpPost]
        [Route("AddOrUpdateObjectTags")]
        public async Task<IActionResult> AddOrUpdateObjectTags(UpdateTagsRequest requestDto)
        {
            await _arch_object_tagUseCases.AddOrUpdateObjectTagsByApplication(requestDto.tags, requestDto.application_id);
            return Ok();
        }
        
        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatearch_object_tagRequest requestDto)
        {
            var request = new Domain.Entities.arch_object_tag
            {
                id = requestDto.id,

                id_object = requestDto.id_object,
                id_tag = requestDto.id_tag,
            };
            var response = await _arch_object_tagUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _arch_object_tagUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _arch_object_tagUseCases.GetOne(id);
            return Ok(response);
        }

        

    }
}
