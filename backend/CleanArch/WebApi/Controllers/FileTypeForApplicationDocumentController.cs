using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FileTypeForApplicationDocumentController : ControllerBase
    {
        private readonly FileTypeForApplicationDocumentUseCases _fileTypeForApplicationDocumentUseCases;

        public FileTypeForApplicationDocumentController(FileTypeForApplicationDocumentUseCases fileTypeForApplicationDocumentUseCases)
        {
            _fileTypeForApplicationDocumentUseCases = fileTypeForApplicationDocumentUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _fileTypeForApplicationDocumentUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _fileTypeForApplicationDocumentUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _fileTypeForApplicationDocumentUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateFileTypeForApplicationDocumentRequest requestDto)
        {
            var request = new Domain.Entities.FileTypeForApplicationDocument
            {
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
            };
            var response = await _fileTypeForApplicationDocumentUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateFileTypeForApplicationDocumentRequest requestDto)
        {
            var request = new Domain.Entities.FileTypeForApplicationDocument
            {
                id = requestDto.id,
                name = requestDto.name,
                description = requestDto.description,
                code = requestDto.code,
            };
            var response = await _fileTypeForApplicationDocumentUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _fileTypeForApplicationDocumentUseCases.Delete(id);
            return Ok();
        }
    }
}
