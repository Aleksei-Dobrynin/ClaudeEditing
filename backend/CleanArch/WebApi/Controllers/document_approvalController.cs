using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class document_approvalController : ControllerBase
    {
        private readonly document_approvalUseCases _document_approvalUseCases;

        public document_approvalController(document_approvalUseCases document_approvalUseCases)
        {
            _document_approvalUseCases = document_approvalUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _document_approvalUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _document_approvalUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createdocument_approvalRequest requestDto)
        {
            var request = new Domain.Entities.document_approval
            {
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                app_document_id = requestDto.app_document_id,
                file_sign_id = requestDto.file_sign_id,
                department_id = requestDto.department_id,
                position_id = requestDto.position_id,
                status = requestDto.status,
                approval_date = requestDto.approval_date,
                comments = requestDto.comments,
                created_at = requestDto.created_at,
                app_step_id = requestDto.app_step_id,
                document_type_id = requestDto.document_type_id,
                is_final = requestDto.is_final,
                source_approver_id = requestDto.source_approver_id,
                is_manually_modified = requestDto.is_manually_modified,
                last_sync_at = requestDto.last_sync_at,
                order_number =requestDto.order_number
            };
            var response = await _document_approvalUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatedocument_approvalRequest requestDto)
        {
            var request = new Domain.Entities.document_approval
            {
                id = requestDto.id,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                app_document_id = requestDto.app_document_id,
                file_sign_id = requestDto.file_sign_id,
                department_id = requestDto.department_id,
                position_id = requestDto.position_id,
                status = requestDto.status,
                approval_date = requestDto.approval_date,
                comments = requestDto.comments,
                created_at = requestDto.created_at,
                app_step_id = requestDto.app_step_id,
                document_type_id = requestDto.document_type_id,
                is_final = requestDto.is_final,
                source_approver_id = requestDto.source_approver_id,
                is_manually_modified = requestDto.is_manually_modified,
                last_sync_at = requestDto.last_sync_at,
                order_number = requestDto.order_number
            };
            var response = await _document_approvalUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _document_approvalUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _document_approvalUseCases.GetOne(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByapp_document_id")]
        public async Task<IActionResult> GetByapp_document_id(int app_document_id)
        {
            var response = await _document_approvalUseCases.GetByapp_document_id(app_document_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByfile_sign_id")]
        public async Task<IActionResult> GetByfile_sign_id(int file_sign_id)
        {
            var response = await _document_approvalUseCases.GetByfile_sign_id(file_sign_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetBydepartment_id")]
        public async Task<IActionResult> GetBydepartment_id(int department_id)
        {
            var response = await _document_approvalUseCases.GetBydepartment_id(department_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByposition_id")]
        public async Task<IActionResult> GetByposition_id(int position_id)
        {
            var response = await _document_approvalUseCases.GetByposition_id(position_id);
            return Ok(response);
        }

        /// <summary>
        /// Получает согласования с информацией о назначенных исполнителях
        /// Возвращает данные с сортировкой по order_number (NULL в конец) 
        /// и списком assigned_approvers для каждого согласования
        /// Формат имени: "Иванов И.И. (Главный специалист Отдел архитектуры)"
        /// </summary>
        /// <param name="applicationId">ID заявки</param>
        /// <param name="stepId">ID этапа (опционально)</param>
        /// <returns>Список согласований с assigned_approvers</returns>
        /// <response code="200">Успешное получение данных</response>
        /// <response code="400">Некорректные параметры запроса</response>
        /// <response code="500">Внутренняя ошибка сервера</response>
        [HttpGet]
        [Route("GetByApplicationWithAssignees")]
        public async Task<IActionResult> GetByApplicationWithAssignees(
            [FromQuery] int applicationId,
            [FromQuery] int? stepId = null)
        {
            try
            {
                if (applicationId <= 0)
                {
                    return BadRequest(new
                    {
                        error = "Invalid applicationId",
                        message = "applicationId должен быть больше 0"
                    });
                }

                var response = await _document_approvalUseCases.GetApprovalsWithAssignees(
                    applicationId,
                    stepId
                );

                return Ok(response);
            }
            catch (Exception ex)
            {
                // Логирование ошибки
                Console.WriteLine($"Error in GetByApplicationWithAssignees: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");

                return StatusCode(500, new
                {
                    error = "Internal server error",
                    message = "Произошла ошибка при получении согласований",
                    details = ex.Message
                });
            }
        }
    }
}