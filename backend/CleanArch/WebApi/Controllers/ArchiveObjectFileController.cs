using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ArchiveObjectFileController : ControllerBase
    {
        private readonly ArchiveObjectFileUseCases _archiveObjectFileUseCases;

        public ArchiveObjectFileController(ArchiveObjectFileUseCases archiveObjectFileUseCases)
        {
            _archiveObjectFileUseCases = archiveObjectFileUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _archiveObjectFileUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetNotInFolder")]
        public async Task<IActionResult> GetNotInFolder()
        {
            var response = await _archiveObjectFileUseCases.GetNotInFolder();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByidArchiveObject")]
        public async Task<IActionResult> GetByidArchiveObject(int idArchiveObject)
        {
            var response = await _archiveObjectFileUseCases.GetByidArchiveObject(idArchiveObject);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByidArchiveFolder")]
        public async Task<IActionResult> GetByidArchiveFolder(int idArchiveFolder)
        {
            var response = await _archiveObjectFileUseCases.GetByidArchiveFolder(idArchiveFolder);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _archiveObjectFileUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _archiveObjectFileUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create([FromForm] CreateArchiveObjectFileRequest requestDto)
        {
            var request = new Domain.Entities.ArchiveObjectFile
            {
                archive_object_id = requestDto.archive_object_id,
                file_id = requestDto.file_id,
                name = requestDto.name
            };
            
            if (requestDto.document?.file != null && requestDto.document.file.Length > 0)
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
                var response = await _archiveObjectFileUseCases.Create(request);
                return ActionResultHelper.FromResult(response);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [Route("SetTagsToFile")]
        public async Task<IActionResult> SetTagsToFile(SetTagsToFileRequest req)
        {
            var response = await _archiveObjectFileUseCases.SetTagsToFile(req.file_id, req.tag_ids);
            return Ok();
        }
        public class SetTagsToFileRequest
        {
            public List<int> tag_ids { get; set; }
            public int file_id { get; set; }
        }

        [HttpPost]
        [Route("SendFilesToFolder")]
        public async Task<IActionResult> SendFilesToFolder(SendFilesToFolderReq req)
        {
            var response = await _archiveObjectFileUseCases.SendFilesToFolder(req.folder_id, req.file_ids);
            return Ok();
        }
        public class SendFilesToFolderReq
        {
            public List<int> file_ids { get; set; }
            public int folder_id { get; set; }
        }

        // [HttpPut]
        // [Route("Update")]
        // public async Task<IActionResult> Update(UpdateArchiveObjectFileRequest requestDto)
        // {
        //     var request = new Domain.Entities.ArchiveObjectFile
        //     {
        //         id = requestDto.id,
        //         archive_object_id = requestDto.archive_object_id,
        //         file_id = requestDto.file_id,
        //         name = requestDto.name
        //     };
        //     var response = await _archiveObjectFileUseCases.Update(request);
        //     return Ok(response);
        // }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _archiveObjectFileUseCases.Delete(id);
            return Ok();
        }
    }
}
