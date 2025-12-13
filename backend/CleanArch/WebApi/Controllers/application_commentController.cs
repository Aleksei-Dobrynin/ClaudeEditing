using Application.UseCases;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class application_commentController : ControllerBase
    {
        private readonly application_commentUseCases _application_commentUseCases;

        public application_commentController(application_commentUseCases application_commentUseCases)
        {
            _application_commentUseCases = application_commentUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _application_commentUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _application_commentUseCases.GetOne(id);
            return Ok(response);
        }

        //[HttpGet]
        //[Route("GetPaginated")]
        //public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        //{
        //    var response = await _application_commentUseCases.GetPagniated(pageSize, pageNumber);
        //    return Ok(response);
        //}

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(Createapplication_commentRequest requestDto)
        {
            var request = new Domain.Entities.application_comment
            {
                id = requestDto.id,
                application_id = requestDto.application_id,
                comment = requestDto.comment,
                type_id = requestDto.comment_type_id != 0 ? requestDto.comment_type_id : null,
                employee_id = requestDto.employee_id,
            };
            var response = await _application_commentUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update (UpdateApplication_commentRequest requestDto)
        {
            var request = new Domain.Entities.application_comment
            {
                id = requestDto.id,
                application_id = requestDto.application_id,
                comment = requestDto.comment,
                created_at = requestDto.created_at,
                created_by = requestDto.created_by,
                updated_at = requestDto.updated_at,
                updated_by = requestDto.updated_by
            };
            var response = await _application_commentUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _application_commentUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByapplication_id")]
        public async Task<IActionResult> GetByapplication_id(int application_id)
        {
            var response = await _application_commentUseCases.GetByapplication_id(application_id);
            return Ok(response);
        } 
        
        [HttpGet]
        [Route("MyAssigned")]
        public async Task<IActionResult> MyAssigned()
        {
            var response = await _application_commentUseCases.MyAssigned();
            return Ok(response);
        }
        
        [HttpGet]
        [Route("CompleteComment")]
        public async Task<IActionResult> CompleteComment(int id)
        {
            var response = await _application_commentUseCases.CompleteComment(id);
            return Ok(response);
        } 
    }
}
