using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class TechCouncilController : ControllerBase
    {
        private readonly TechCouncilUseCases _TechCouncilUseCases;
        private readonly FileUseCases _fileUseCases;
        private readonly TechCouncilFilesUseCases _techCouncilFilesUseCases;

        public TechCouncilController(TechCouncilUseCases TechCouncilUseCases, FileUseCases fileUseCases, TechCouncilFilesUseCases filesUseCases)
        {
            _TechCouncilUseCases = TechCouncilUseCases;
            _fileUseCases = fileUseCases;
            _techCouncilFilesUseCases = filesUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _TechCouncilUseCases.GetAll();
            return Ok(response);
        }        
        
        [HttpGet]
        [Route("GetTable")]
        public async Task<IActionResult> GetTable()
        {
            var response = await _TechCouncilUseCases.GetTable();
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetTableBySession")]
        public async Task<IActionResult> GetTableBySession(int session_id)
        {
            var response = await _TechCouncilUseCases.GetTableBySession(session_id);
            return Ok(response);
        }        
        
        [HttpGet]
        [Route("GetTableByStructure")]
        public async Task<IActionResult> GetTableByStructure(int structure_id)
        {
            var response = await _TechCouncilUseCases.GetTableByStructure(structure_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetTableWithOutSession")]
        public async Task<IActionResult> GetTableWithOutSession()
        {
            var response = await _TechCouncilUseCases.GetTableWithOutSession();
            return Ok(response);
        }
        
        [HttpPost]
        [Route("UpdateSessionOneCase")]
        public async Task<IActionResult> UpdateSessionOneCase(UpdateSessionOneCaseRequest request)
        {
            await _TechCouncilUseCases.UpdateSession(request.application_id, request.session_id);
            return Ok();
        }
        
        [HttpPost]
        [Route("UpdateSession")]
        public async Task<IActionResult> UpdateSession(UpdateSessionRequest request)
        {
            await _TechCouncilUseCases.UpdateSession(request.application_ids, request.session_id);
            return Ok();
        }
                
        [HttpGet]
        [Route("GetCountMyStructure")]
        public async Task<IActionResult> GetCountMyStructure()
        {
            var response = await _TechCouncilUseCases.GetCountMyStructure();
            return Ok(response);
        }
        
        [HttpPost]
        [Route("SendTo")]
        public async Task<IActionResult> SendTo(SendToTechCouncilRequest request)
        {
            var response = await _TechCouncilUseCases.SendTo(request.application_id, request.participants);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByApplicationId")]
        public async Task<IActionResult> GetByApplicationId(int application_id)
        {
            var response = await _TechCouncilUseCases.GetByApplicationId(application_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _TechCouncilUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _TechCouncilUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateTechCouncilRequest requestDto)
        {
            var request = new Domain.Entities.TechCouncil
            {
               structure_id = requestDto.structure_id,
               application_id = requestDto.application_id,
               decision = requestDto.decision,
               decision_type_id = requestDto.decision_type_id,
            };
            var response = await _TechCouncilUseCases.Create(request);
            return Ok(response);
        }
        
        [HttpPost]
        [Route("UploadFile")]
        public async Task<IActionResult> UploadFile([FromForm] UploadFileTechCouncilRequest requestDto)
        {
            var request = new Domain.Entities.FileTechCouncilRequest
            {
                id = requestDto.id,
                structure_id = requestDto.structure_id,
                application_id = requestDto.application_id
            };
            
            if (requestDto.document.file != null && requestDto.document.file.Length > 0)
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
                var response = await _TechCouncilUseCases.UploadFile(request);
                return Ok(response);
            }
            else
            {
                return BadRequest();
            }
        }
        
        [HttpPost]
        [Route("UpdateLegalRecords")]
        public async Task<IActionResult> UpdateLegalRecords(UpdateLegalRecordsRequest request)
        {
            var response = await _TechCouncilUseCases.UpdateLegalRecords(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateTechCouncilRequest requestDto)
        {
            var request = new Domain.Entities.TechCouncil
            {
               id = requestDto.id,
               structure_id = requestDto.structure_id,
               application_id = requestDto.application_id,
               decision = requestDto.decision,
               decision_type_id = requestDto.decision_type_id,
            };
            var response = await _TechCouncilUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _TechCouncilUseCases.Delete(id);
            return Ok();
        }
    }
}
