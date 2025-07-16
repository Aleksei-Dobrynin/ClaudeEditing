using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SurveyTagsController : ControllerBase
    {
        private readonly SurveyTagsUseCases _SurveyTagsUseCases;

        public SurveyTagsController(SurveyTagsUseCases SurveyTagsUseCases)
        {
            _SurveyTagsUseCases = SurveyTagsUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _SurveyTagsUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _SurveyTagsUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateSurveyTagsRequest requestDto)
        {
            var request = new Domain.Entities.SurveyTags
            {
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                idCustomSvgIcon = requestDto.idCustomSvgIcon,
            };
            var response = await _SurveyTagsUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateSurveyTagsRequest requestDto)
        {
            var request = new Domain.Entities.SurveyTags
            {
                id = requestDto.id,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
                idCustomSvgIcon = requestDto.idCustomSvgIcon,
            };
            var response = await _SurveyTagsUseCases.Update(request);
            return Ok(response);
        }
    }
}
