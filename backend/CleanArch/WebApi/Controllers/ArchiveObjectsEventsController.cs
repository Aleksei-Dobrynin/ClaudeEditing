using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ArchiveObjectsEventsController : ControllerBase
    {
        private readonly ArchiveObjectsEventsUseCases _archiveobjectseventsUseCases;

        public ArchiveObjectsEventsController(ArchiveObjectsEventsUseCases archiveobjectseventsUseCases)
        {
            _archiveobjectseventsUseCases = archiveobjectseventsUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _archiveobjectseventsUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _archiveobjectseventsUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByObjectId")]
        public async Task<IActionResult> GetByObjectId(int archiveObjectId)
        {
            var response = await _archiveobjectseventsUseCases.GetByObjectId(archiveObjectId);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByEventTypeId")]
        public async Task<IActionResult> GetByEventTypeId(int eventTypeId)
        {
            var response = await _archiveobjectseventsUseCases.GetByEventTypeId(eventTypeId);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByObjectIdPaginated")]
        public async Task<IActionResult> GetByObjectIdPaginated(int archiveObjectId, int pageSize, int pageNumber)
        {
            var response = await _archiveobjectseventsUseCases.GetByObjectIdPaginated(archiveObjectId, pageSize, pageNumber);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByEventTypeIdPaginated")]
        public async Task<IActionResult> GetByEventTypeIdPaginated(int eventTypeId, int pageSize, int pageNumber)
        {
            var response = await _archiveobjectseventsUseCases.GetByEventTypeIdPaginated(eventTypeId, pageSize, pageNumber);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _archiveobjectseventsUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateArchiveObjectsEventsRequest requestDto)
        {
            var request = new Domain.Entities.ArchiveObjectsEvents
            {
                description = requestDto.description,
                employee_id = requestDto.employee_id,
                head_structure_id = requestDto.head_structure_id,
                //created_at = requestDto.created_at,
                //updated_at = requestDto.updated_at,
                //created_by = requestDto.created_by,
                //updated_by = requestDto.updated_by,
                archive_object_id = requestDto.archive_object_id,
                event_type_id = requestDto.event_type_id,
                event_date = requestDto.event_date,
                structure_id = requestDto.structure_id,
                application_id = requestDto.application_id,
            };
            var response = await _archiveobjectseventsUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateArchiveObjectsEventsRequest requestDto)
        {
            var request = new Domain.Entities.ArchiveObjectsEvents
            {
                id = requestDto.id,
                description = requestDto.description,
                employee_id = requestDto.employee_id,
                head_structure_id = requestDto.head_structure_id,
                //created_at = requestDto.created_at,
                //updated_at = requestDto.updated_at,
                //created_by = requestDto.created_by,
                //updated_by = requestDto.updated_by,
                archive_object_id = requestDto.archive_object_id,
                event_type_id = requestDto.event_type_id,
                event_date = requestDto.event_date,
                structure_id = requestDto.structure_id,
                application_id = requestDto.application_id,
            };
            var response = await _archiveobjectseventsUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _archiveobjectseventsUseCases.Delete(id);
            return Ok();
        }
    }
}