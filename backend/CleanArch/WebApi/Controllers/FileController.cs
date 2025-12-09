using Application.UseCases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using WebApi.Dtos.WebApi.Dtos;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class FileController : ControllerBase
    {
        private readonly FileUseCases _fileUseCases;

        public FileController(FileUseCases fileUseCases)
        {
            _fileUseCases = fileUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _fileUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetSignByFileId")]
        public async Task<IActionResult> GetSignByFileIds(int id)
        {
            var response = await _fileUseCases.GetSignByFileIds(new int[] {id});
            return Ok(response);
        }

        [HttpGet]
        [Route("DownloadDocument")]
        public async Task<IActionResult> DownloadDocument(int id)
        {
            var doc = await _fileUseCases.DownloadDocument(id);
            if (doc?.body == null) return NotFound();
            return Ok(File(doc.body, "application/octet-stream", doc.name));
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("DownloadDocumentFromCabinet")]
        public async Task<IActionResult> DownloadDocumentFromCabinet(int id)
        {
            var doc = await _fileUseCases.DownloadDocumentFromCabinet(id);
            if (doc?.body == null) return NotFound();
            return Ok(File(doc.body, "application/octet-stream", doc.name));
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("DownloadDocumentFromCabinet2")]
        public async Task<IActionResult> DownloadDocumentFromCabinet2(int id)
        {
            var doc = await _fileUseCases.DownloadDocumentFromCabinet(id);
            if (doc?.body == null) return NotFound();
            return File(doc.body, "application/octet-stream", doc.name);
        }

        //[HttpGet]
        //[Route("SignDocument")]
        //public async Task<IActionResult> SignDocument(int id, int? uplId, string pin, string code)
        //{
        //    var res =await _fileUseCases.SignDocument(id, uplId, pin, code);
        //    return Ok(res);
        //}

        [HttpGet]
        [Route("CallOutSignDocument")]
        public async Task<IActionResult> CallOutSignDocument(int id)
        {
            var res = await _fileUseCases.CallOutSignDocument(id);
            return Ok(res);
        }

        [HttpGet]
        [Route("GetAllSignByUser")]
        public async Task<IActionResult> GetAllSignByUser()
        {
            var res =await _fileUseCases.GetAllSignByUser();
            return Ok(res);
        }
        
        [HttpGet]
        [Route("GetSignEmployeeListByFile")]
        public async Task<IActionResult> GetSignEmployeeListByFile(int id)
        {
            var res =await _fileUseCases.GetSignEmployeeListByFile(id);
            return Ok(res);
        }

        [HttpGet]
        [Route("SendCode")]
        public async Task<IActionResult> SendCode(string pin)
        {
            var res = await _fileUseCases.SendCode(pin);
            return Ok(res);
        }


        [HttpGet]
        [Route("DownloadVideo")]
        public async Task<IActionResult> DownloadVideo(int id)
        {
            try
            {
                var doc = await _fileUseCases.DownloadDocument(id);
                if (doc?.body == null)
                    return NotFound(new { message = "Document not found." });

                return File(doc.body, "video/mp4", doc.name);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }

        [HttpPost]
        [Route("ReadExcel")]
        public async Task<IActionResult> ReadExcel([FromForm] FileExcelRequest requestDto)
        {
            if (requestDto.document.file != null && requestDto.document.file.Length > 0)
            {
                var ms = new MemoryStream();
                requestDto.document.file.CopyTo(ms);
                await _fileUseCases.ReadExcel(ms, requestDto.bank_id);
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
        
        [HttpGet]
        [Route("GetFileLog")]
        public async Task<IActionResult> GetFileLog()
        {
            return Ok(await _fileUseCases.GetFileLog());
        }

        // ОБНОВЛЕННЫЙ метод SignDocument (ЗАМЕНИТЬ существующий)
        [HttpPost]
        [Route("SignDocument")]
        public async Task<IActionResult> SignDocument([FromBody] SignDocumentRequest request)
        {
            try
            {
                var result = await _fileUseCases.SignDocument(
                    request.FileId,
                    request.UplId,
                    request.Pin,
                    request.Code,
                    request.PositionId,
                    request.DepartmentId
                );

                return Ok(new SignDocumentResponse
                {
                    SignId = result,
                    Success = true,
                    Message = "Документ успешно подписан"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new SignDocumentResponse
                {
                    SignId = 0,
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        // НОВЫЙ метод GetAvailableSigningRoles (ДОБАВИТЬ в контроллер)
        /// <summary>
        /// Получить список доступных ролей для подписи документа
        /// </summary>
        /// <param name="fileId">ID файла</param>
        /// <returns>Список ролей с информацией о статусе подписи</returns>
        [HttpGet]
        [Route("GetAvailableSigningRoles")]
        public async Task<IActionResult> GetAvailableSigningRoles([FromQuery] int fileId)
        {
            try
            {
                var roles = await _fileUseCases.GetAvailableSigningRoles(fileId);
                return Ok(roles);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
