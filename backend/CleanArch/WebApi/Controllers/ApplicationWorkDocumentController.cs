using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;
using Domain.Entities;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ApplicationWorkDocumentController : ControllerBase
    {
        private readonly ApplicationWorkDocumentUseCases _applicationWorkDocumentUseCases;

        public ApplicationWorkDocumentController(ApplicationWorkDocumentUseCases applicationDocumentTypeUseCases)
        {
            _applicationWorkDocumentUseCases = applicationDocumentTypeUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _applicationWorkDocumentUseCases.GetAll();
            return Ok(response);
        }        
        
        [HttpGet]
        [Route("GetByStepID")]
        public async Task<IActionResult> GetByStepID(int app_step_id)
        {
            var response = await _applicationWorkDocumentUseCases.GetByStepID(app_step_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _applicationWorkDocumentUseCases.GetOneByID(id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByIDTask")]
        public async Task<IActionResult> GetByIDTask(int idTask)
        {
            var response = await _applicationWorkDocumentUseCases.GetByIDTask(idTask);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByIDApplication")]
        public async Task<IActionResult> GetByIDApplication(int idApplication)
        {
            var response = await _applicationWorkDocumentUseCases.GetByIDApplication(idApplication);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByGuid")]
        [AllowAnonymous]
        public async Task<IActionResult> GetByGuid(string guid)
        {
            var response = await _applicationWorkDocumentUseCases.GetByGuid(guid);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneByGuid")]
        [AllowAnonymous]
        public async Task<IActionResult> GetOneByGuid(string guid)
        {
            var response = await _applicationWorkDocumentUseCases.GetOneByGuid(guid);
            return Ok(response);
        }

        public class ApiResponse<T>
        {
            public bool Success { get; set; }
            public string Message { get; set; }
            public T Data { get; set; }
            public string ErrorCode { get; set; }

            public static ApiResponse<T> SuccessResponse(T data, string message = "Успешно")
            {
                return new ApiResponse<T>
                {
                    Success = true,
                    Message = message,
                    Data = data
                };
            }

            public static ApiResponse<T> ErrorResponse(string message, string errorCode = null)
            {
                return new ApiResponse<T>
                {
                    Success = false,
                    Message = message,
                    ErrorCode = errorCode
                };
            }
        }

        public class Result
        {
            public bool Value { get; set; }
        }

        [HttpGet]
        [Route("GetOneEncryptedByGuid")]
        [AllowAnonymous]
        public async Task<IActionResult> GetOneEncryptedByGuid(string guid)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(guid))
                {
                    return BadRequest(ApiResponse<object>.ErrorResponse("GUID не может быть пустым", "INVALID_GUID"));
                }

                var response = await _applicationWorkDocumentUseCases.GetOneEncryptedByGuid(guid);

                if (response == null)
                {
                    return NotFound(ApiResponse<object>.ErrorResponse("Документ не найден", "DOCUMENT_NOT_FOUND"));
                }

                return Ok(ApiResponse<ApplicationWorkDocument>.SuccessResponse(response, "Документ успешно получен"));
            }
            catch (UnauthorizedAccessException ex)
            {
                // Определяем тип ошибки по сообщению
                string errorCode = ex.Message.Contains("истек") ? "TOKEN_EXPIRED" : "INVALID_TOKEN";
                return Unauthorized(ApiResponse<object>.ErrorResponse(ex.Message, errorCode));
            }
            catch (Exception ex)
            {
                // Логируем неожиданные ошибки
                return StatusCode(500, ApiResponse<object>.ErrorResponse("Внутренняя ошибка сервера", "INTERNAL_ERROR"));
            }
        }

        [HttpPost]
        [Route("SendDocumentsToEmail")]
        [AllowAnonymous]
        public async Task<IActionResult> GetOneEncryptedByGuid(SendDocumentsToEmailRequest item)
        {
            var response = await _applicationWorkDocumentUseCases.SendDocumentsToEmail(item);
            return Ok(response);
        }


        [HttpGet]
        [Route("ApplicationPaymentCheck")]
        public async Task<IActionResult> ApplicationPaymentCheck(int idAplication)
        {
            var responce = await _applicationWorkDocumentUseCases.ApplicationPaymentCheck(idAplication);

            var result = new Result { Value = responce };
            if (responce)
            {
                return Ok(result);
            }
            return Ok(result);

        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _applicationWorkDocumentUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _applicationWorkDocumentUseCases.Delete(id);
            return Ok();
        }

        [HttpPost]
        [Route("DeactivateDocument")]
        public async Task<IActionResult> DeactivateDocument(DeactivateDocumentReq req)
        {
            await _applicationWorkDocumentUseCases.DeactivateDocument(req.id, req.reason);
            return Ok();
        }
        public class DeactivateDocumentReq
        {
            public string reason { get; set; }
            public int id { get; set; }
        }

        [HttpPost]
        [Route("AddDocument")]
        public async Task<IActionResult> AddDocument([FromForm] AddApplicationWorkDocumentRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationWorkDocument
            {
                task_id = requestDto.task_id,
                comment = requestDto.comment,
                id_type = requestDto.id_type,
                structure_employee_id = requestDto.structure_employee_id,
                metadata = requestDto.metadata,
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
                
                var response = await _applicationWorkDocumentUseCases.AddDocument(request);
                return ActionResultHelper.FromResult(response);
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [Route("SetFileToDocument")]
        public async Task<IActionResult> SetFileToDocument([FromForm] AddApplicationWorkDocumentRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationWorkDocument
            {
                task_id = requestDto.task_id,
                comment = requestDto.comment,
                id_type = requestDto.id_type,
                structure_employee_id = requestDto.structure_employee_id,
                metadata = requestDto.metadata,
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
                
                var response = await _applicationWorkDocumentUseCases.SetFileToDocument(requestDto.id, request.document, requestDto.comment);
                return ActionResultHelper.FromResult(response);
            }
            else
            {
                return BadRequest();
            }
        }
        
        [HttpPost]
        [Route("AddDocumentFromTemplate")]
        public async Task<IActionResult> AddDocumentFromTemplate(AddApplicationWorkDocumentRequest requestDto)
        {
            var request = new Domain.Entities.ApplicationWorkDocument
            {
                task_id = requestDto.task_id,
                comment = requestDto.comment,
                id_type = requestDto.id_type,
                structure_employee_id = requestDto.structure_employee_id,
                metadata = requestDto.metadata,
                document_body = requestDto.document_body,
                document_name = requestDto.document_name,
            };
            
            var response = await _applicationWorkDocumentUseCases.AddDocumentFromTemplate(request);
            return Ok(response);
        }
    }
}
