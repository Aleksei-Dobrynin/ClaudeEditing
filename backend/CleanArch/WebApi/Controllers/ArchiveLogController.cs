using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Domain.Entities;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ArchiveLogController : ControllerBase
    {
        private readonly ArchiveLogUseCases _archiveLogUseCases;

        public ArchiveLogController(ArchiveLogUseCases archiveLogUseCases)
        {
            _archiveLogUseCases = archiveLogUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _archiveLogUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _archiveLogUseCases.GetOneByID(id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetGroupByParentID")]
        public async Task<IActionResult> GetGroupByParentID(int id)
        {
            var response = await _archiveLogUseCases.GetGroupByParentID(id);
            return Ok(response);
        }
        
        [HttpPost]
        [Route("GetByFilter")]
        public async Task<IActionResult> GetByFilter(ArchiveLogFilter filter)
        {
            var response = await _archiveLogUseCases.GetByFilter(filter);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _archiveLogUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateArchiveLogRequest requestDto)
        {
            var request = new ArchiveLog
            {
                doc_number = requestDto.doc_number,
                address = requestDto.address,
                status_id = requestDto.status_id,
                date_return = requestDto.date_return,
                take_structure_id = requestDto.take_structure_id,
                take_employee_id = requestDto.take_employee_id,
                return_structure_id = requestDto.return_structure_id,
                return_employee_id = requestDto.return_employee_id,
                date_take = requestDto.date_take,
                name_take = requestDto.name_take,
                //archiveObjects = requestDto.archiveObjects,
                deadline = requestDto.deadline,
                archive_folder_id = requestDto.archive_folder_id
            };
            var response = await _archiveLogUseCases.Create(request);
            return Ok(response);
        }
        
        [HttpPost]
        [Route("ChangeStatus")]
        public async Task<IActionResult> ChangeStatus(ChangeArchiveLogStatusRequest model)
        {
            var response = await _archiveLogUseCases.ChangeStatus(model.archive_log_id, model.status_id);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateArchiveLogRequest requestDto)
        {
            var request = new ArchiveLog
            {
                id = requestDto.id,
                doc_number = requestDto.doc_number,
                address = requestDto.address,
                status_id = requestDto.status_id,
                date_return = requestDto.date_return,
                deadline = requestDto.deadline,
                take_structure_id = requestDto.take_structure_id,
                take_employee_id = requestDto.take_employee_id,
                return_structure_id = requestDto.return_structure_id,
                return_employee_id = requestDto.return_employee_id,
                date_take = requestDto.date_take,
                name_take = requestDto.name_take,
                archive_folder_id = requestDto.archive_folder_id
            };
            var response = await _archiveLogUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _archiveLogUseCases.Delete(id);
            return Ok();
        }

        [HttpGet]
        [Route("GetForPivotDashboard")]
        public async Task<IActionResult> GetForPivotDashboard(DateTime date_start, DateTime date_end)
        {
            var response = await _archiveLogUseCases.GetForPivotDashboard(date_start, date_end);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetForPivotDashboardMyStructure")]
        public async Task<IActionResult> GetForPivotDashboardMyStructure(DateTime date_start, DateTime date_end)
        {
            var response = await _archiveLogUseCases.GetForPivotDashboardMyStructure(date_start, date_end);
            return Ok(response);
        }
    }
}
