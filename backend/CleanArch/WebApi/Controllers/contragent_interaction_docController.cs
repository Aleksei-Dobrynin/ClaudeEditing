using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class contragent_interaction_docController : ControllerBase
    {
        private readonly contragent_interaction_docUseCases _contragent_interaction_docUseCases;

        public contragent_interaction_docController(contragent_interaction_docUseCases contragent_interaction_docUseCases)
        {
            _contragent_interaction_docUseCases = contragent_interaction_docUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _contragent_interaction_docUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _contragent_interaction_docUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] Createcontragent_interaction_docRequest requestDto)
        {
            var request = new Domain.Entities.contragent_interaction_doc
            {
                file_id = requestDto.file_id,
                interaction_id = requestDto.interaction_id,
                message = requestDto.message,
                is_portal = requestDto.is_portal,
                for_customer = requestDto.for_customer,
            };

            if (requestDto?.document?.file != null)
            {
                byte[] fileBytes = null;
                if (requestDto.document.file.Length > 0)
                {
                    using var ms = new MemoryStream();
                    requestDto.document.file.CopyTo(ms);
                    fileBytes = ms.ToArray();
                }
                request.document = new Domain.Entities.File
                {
                    body = fileBytes,
                    name = requestDto.document.name,
                };

            }

            var response = await _contragent_interaction_docUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatecontragent_interaction_docRequest requestDto)
        {
            var request = new Domain.Entities.contragent_interaction_doc
            {
                id = requestDto.id,
                
                file_id = requestDto.file_id,
                interaction_id = requestDto.interaction_id,
            };
            var response = await _contragent_interaction_docUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _contragent_interaction_docUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _contragent_interaction_docUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByfile_id")]
        public async Task<IActionResult> GetByfile_id(int file_id)
        {
            var response = await _contragent_interaction_docUseCases.GetByfile_id(file_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByinteraction_id")]
        public async Task<IActionResult> GetByinteraction_id(int interaction_id)
        {
            var response = await _contragent_interaction_docUseCases.GetByinteraction_id(interaction_id);
            return Ok(response);
        }
        

    }
}
