using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using System.Reflection;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FileForApplicationDocumentController : ControllerBase
    {
        private readonly FileForApplicationDocumentUseCases _fileForApplicationDocumentUseCases;

        public FileForApplicationDocumentController(FileForApplicationDocumentUseCases fileForApplicationDocumentUseCases)
        {
            _fileForApplicationDocumentUseCases = fileForApplicationDocumentUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _fileForApplicationDocumentUseCases.GetAll();
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByidDocument")]
        public async Task<IActionResult> GetByidDocument(int idDocument)
        {
            var response = await _fileForApplicationDocumentUseCases.GetByidDocument(idDocument);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _fileForApplicationDocumentUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _fileForApplicationDocumentUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create([FromForm] CreateFileForApplicationDocumentRequest requestDto)
        {
            var request = new Domain.Entities.FileForApplicationDocument
            {
                document_id = requestDto.document_id,
                type_id = requestDto.type_id,
                name = requestDto.name,
            };
            if (requestDto.document.file != null)
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
            var response = await _fileForApplicationDocumentUseCases.Create(request);
            return ActionResultHelper.FromResult(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update([FromForm] UpdateFileForApplicationDocumentRequest requestDto)
        {
            var request = new Domain.Entities.FileForApplicationDocument
            {
                id = requestDto.id,
                file_id = requestDto.file_id,
                document_id = requestDto.document_id,
                type_id = requestDto.type_id,
                name = requestDto.name
            };
            if (requestDto.document.file != null)
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
            var response = await _fileForApplicationDocumentUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _fileForApplicationDocumentUseCases.Delete(id);
            return Ok();
        }
    }
}
