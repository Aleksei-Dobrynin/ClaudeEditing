using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;
using static WebApi.Controllers.ApplicationController;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class application_taskController : ControllerBase
    {
        private readonly application_taskUseCases _application_taskUseCases;

        public application_taskController(application_taskUseCases application_taskUseCases)
        {
            _application_taskUseCases = application_taskUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _application_taskUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _application_taskUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] Createapplication_taskRequest requestDto)
        {
            var request = new Domain.Entities.application_task
            {

                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                structure_id = requestDto.structure_id,
                application_id = requestDto.application_id,
                task_template_id = requestDto.task_template_id,
                comment = requestDto.comment,
                name = requestDto.name,
                is_required = requestDto.is_required,
                order = requestDto.order,
                status_id = requestDto.status_id,
                progress = requestDto.progress,
                type_id = requestDto.type_id,
                task_deadline = requestDto.deadline,
                employee_in_structure_ids = requestDto.employee_in_structure_ids
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
            var response = await _application_taskUseCases.Create(request);
            return ActionResultHelper.FromResult(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromForm] Updateapplication_taskRequest requestDto)
        {
            var request = new Domain.Entities.application_task
            {
                id = requestDto.id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                structure_id = requestDto.structure_id,
                application_id = requestDto.application_id,
                task_template_id = requestDto.task_template_id,
                comment = requestDto.comment,
                name = requestDto.name,
                is_required = requestDto.is_required,
                order = requestDto.order,
                status_id = requestDto.status_id,
                progress = requestDto.progress,
                type_id = requestDto.type_id,
                task_deadline = requestDto.deadline

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
            var response = await _application_taskUseCases.Update(request);
            return ActionResultHelper.FromResult(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _application_taskUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _application_taskUseCases.GetOne(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByapplication_id")]
        public async Task<IActionResult> GetByapplication_id(int application_id)
        {
            var response = await _application_taskUseCases.GetByapplication_id(application_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOtherTaskByTaskId")]
        public async Task<IActionResult> GetOtherTaskByTaskId(int task_id)
        {
            var response = await _application_taskUseCases.GetOtherTaskByTaskId(task_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetBytask_template_id")]
        public async Task<IActionResult> GetBytask_template_id(int task_template_id)
        {
            var response = await _application_taskUseCases.GetBytask_template_id(task_template_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetForPivotDashboard")]
        public async Task<IActionResult> GetForPivotDashboard(DateTime date_start, DateTime date_end, bool out_of_date)
        {
            var response = await _application_taskUseCases.GetForPivotDashboard(date_start, date_end, out_of_date);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetForPivotDashboardMyStructure")]
        public async Task<IActionResult> GetForPivotDashboardMyStructure(DateTime date_start, DateTime date_end, bool out_of_date)
        {
            var response = await _application_taskUseCases.GetForPivotDashboardMyStructure(date_start, date_end, out_of_date);
            return Ok(response);
        }     
        
        [HttpGet]
        [Route("GetForPivotHeadDashboard")]
        public async Task<IActionResult> GetForPivotHeadDashboard(DateTime date_start, DateTime date_end, bool out_of_date)
        {
            var response = await _application_taskUseCases.GetForPivotHeadDashboard(date_start, date_end, out_of_date);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetBystatus_id")]
        public async Task<IActionResult> GetBystatus_id(int status_id)
        {
            var response = await _application_taskUseCases.GetBystatus_id(status_id);
            return Ok(response);
        }

        [HttpPost]
        [Route("GetMyTasks")]
        public async Task<IActionResult> GetMyTasks(ParametersTask par)
        {
            var response = await _application_taskUseCases.GetMyTasks(par.search, par.date_start, par.date_end, par.isExpiredTasks, par.isResolwedTasks);
            return Ok(response);
        }

        [HttpPost]
        [Route("GetStructureTasks")]
        public async Task<IActionResult> GetStructureTasks(ParametersTask par)
        {
            var response = await _application_taskUseCases.GetStructureTasks(par.search, par.date_start, par.date_end, par.isExpiredTasks, par.isResolwedTasks);
            return Ok(response);
        }

        [HttpPost]
        [Route("GetAllTasks")]
        public async Task<IActionResult> GetAllTasks(ParametersTask par)
        {
            var response = await _application_taskUseCases.GetAllTasks(par.search, par.date_start, par.date_end, par.page, par.pageSize);
            return Ok(response);
        }

        public class ParametersTask
        {
            public string search { get; set; }
            public DateTime? date_start { get; set; }
            public DateTime? date_end { get; set; }
            public int page { get; set; }
            public int pageSize { get; set; }
            public bool? isExpiredTasks { get; set; }
            public bool? isResolwedTasks { get; set; }
        }

        [HttpPost]
        [Route("ChangeStatus")]
        public async Task<IActionResult> ChangeStatus(ChangeTaskStatus model)
        {
            var response = await _application_taskUseCases.ChangeStatus(model.task_id, model.status_id);
            return Ok(response);
        }

        public class ChangeTaskStatus
        {
            public int task_id { get; set; }
            public int status_id { get; set; }
        }
    }
}
