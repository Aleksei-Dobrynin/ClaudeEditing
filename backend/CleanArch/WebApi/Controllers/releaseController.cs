using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class releaseController : ControllerBase
    {
        private readonly releaseUseCases _releaseUseCases;

        public releaseController(releaseUseCases releaseUseCases)
        {
            _releaseUseCases = releaseUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _releaseUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetReleaseds")]
        public async Task<IActionResult> GetReleaseds()
        {
            var response = await _releaseUseCases.GetReleaseds();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _releaseUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreatereleaseRequest requestDto)
        {
            var request = new Domain.Entities.release
            {
                
                updated_by = requestDto.updated_by,
                number = requestDto.number,
                description = requestDto.description,
                description_kg = requestDto.description_kg,
                code = requestDto.code,
                date_start = requestDto.date_start,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                files = new List<Domain.Entities.File>(),
            };

            if (requestDto.files != null)
            {
                foreach (var file in requestDto.files)
                {
                    if (file?.file != null)
                    {
                        byte[] fileBytes = null;
                        if (file.file.Length > 0)
                        {
                            using var ms = new MemoryStream();
                            file.file.CopyTo(ms);
                            fileBytes = ms.ToArray();
                        }

                        request.files.Add(new Domain.Entities.File
                        {
                            body = fileBytes,
                            name = file.name,
                        });
                    }
                }
            }
            var response = await _releaseUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromForm] UpdatereleaseRequest requestDto)
        {
            var request = new Domain.Entities.release
            {
                id = requestDto.id,
                
                updated_by = requestDto.updated_by,
                number = requestDto.number,
                description = requestDto.description,
                description_kg = requestDto.description_kg,
                code = requestDto.code,
                date_start = requestDto.date_start,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                video_ids = requestDto.video_ids,
                files = new List<Domain.Entities.File>(),
            };

            if (requestDto.files != null)
            {
                foreach (var file in requestDto.files)
                {
                    if (file?.file != null)
                    {
                        byte[] fileBytes = null;
                        if (file.file.Length > 0)
                        {
                            using var ms = new MemoryStream();
                            file.file.CopyTo(ms);
                            fileBytes = ms.ToArray();
                        }

                        request.files.Add(new Domain.Entities.File
                        {
                            body = fileBytes,
                            name = file.name,
                        });
                    }
                }
            }
            var response = await _releaseUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _releaseUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _releaseUseCases.GetOne(id);
            return Ok(response);
        }

        [HttpPost]
        [Route("ApproveRelease")]
        public async Task<IActionResult> ApproveRelease(ApproveReleaseReq req)
        {
            var response = await _releaseUseCases.ApproveRelease(req.id);
            return Ok(response);
        }
        public class ApproveReleaseReq
        {
            public int id { get; set; }
        }

        [HttpGet]
        [Route("GetLastRelease")]
        public async Task<IActionResult> GetLastRelease()
        {
            var response = await _releaseUseCases.GetLastRelease();
            return Ok(response);
        }

    }
}
