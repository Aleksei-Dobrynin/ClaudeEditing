using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class uploaded_application_documentController : ControllerBase
    {
        private readonly uploaded_application_documentUseCases _uploaded_application_documentUseCases;

        public uploaded_application_documentController(uploaded_application_documentUseCases uploaded_application_documentUseCases)
        {
            _uploaded_application_documentUseCases = uploaded_application_documentUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _uploaded_application_documentUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _uploaded_application_documentUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }



        [HttpPost]
        public async Task<IActionResult> Create([FromForm] Createuploaded_application_documentRequest requestDto)
        {
            var request = new Domain.Entities.uploaded_application_document
            {
                id = requestDto.id,
                file_id = requestDto.file_id,
                application_document_id = requestDto.application_document_id,
                name = requestDto.name,
                service_document_id = requestDto.service_document_id,
                created_at = requestDto.created_at,
                app_step_id = requestDto.app_step_id,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                document_number = requestDto.document_number,
                status_id = requestDto.status_id,

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
            if (request.id == 0)
            {
                var response = await _uploaded_application_documentUseCases.Create(request);
                return ActionResultHelper.FromResult(response);
            }
            else
            {
                var response = await _uploaded_application_documentUseCases.Update(request);
                request = response;
            }
            return Ok(request);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("GetUploadsByGuidCabinet")]
        public async Task<IActionResult> GetUploadsByGuidCabinet(string guid)
        {
            var response = await _uploaded_application_documentUseCases.GetUploadsByGuidCabinet(guid);
            return Ok(response);
        }
        [HttpPost]
        [Route("CreateByBot")]
        public async Task<IActionResult> CreateByBot([FromForm] Createuploaded_application_documentRequest requestDto)
        {
            var request = new Domain.Entities.uploaded_application_document
            {

                file_id = requestDto.file_id,
                application_document_id = requestDto.application_document_id,
                name = requestDto.name,
                service_document_id = requestDto.service_document_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
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

            var response = await _uploaded_application_documentUseCases.CreateWithoutUser(request);
            return ActionResultHelper.FromResult(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Add(Createuploaded_application_documentRequest requestDto)
        {
            var request = new uploaded_application_document
            {

                file_id = requestDto.file_id,
                application_document_id = requestDto.application_document_id,
                name = requestDto.name,
                service_document_id = requestDto.service_document_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                document_number = requestDto.document_number,
                app_docs = requestDto.app_docs
            };

            var response = await _uploaded_application_documentUseCases.Add(request);
            return Ok(response);
        }

        [HttpPost]
        [Route("CopyUploadedDocument")]
        public async Task<IActionResult> CopyUploadedDocument(CopyUploadedDocumentDto request)
        {

            var response = await _uploaded_application_documentUseCases.CopyUploadedDocument(request);
            return Ok(response);
        }

        [HttpPost]
        [Route("AccepDocument")]
        public async Task<IActionResult> AccepDocumentWithoutFile(Createuploaded_application_documentRequest requestDto)
        {

            var request = new Domain.Entities.uploaded_application_document
            {
                file_id = null,
                application_document_id = requestDto.application_document_id,
                name = requestDto.name,
                service_document_id = requestDto.service_document_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
                document_number = requestDto.document_number
            };
            var response = await _uploaded_application_documentUseCases.AccepDocumentWithoutFile(request);
            return Ok(response);
        }
        public class RejectDocumentModel
        {
            public int doc_id { get; set; }
        }
        [HttpPost]
        [Route("RejectDocument")]
        public async Task<IActionResult> RejectDocument(RejectDocumentModel model)
        {
            var response = await _uploaded_application_documentUseCases.RejectDocument(model.doc_id);
            return Ok(response);
        }


        public class UploadTemplateModel
        {
            public string html { get; set; }
            public string template_code { get; set; }
            public int application_id { get; set; }
        }


        [HttpPost]
        [Route("UploadTemplate")]
        public async Task<IActionResult> UploadTemplate(UploadTemplateModel model)
        {
            var response = await _uploaded_application_documentUseCases.UploadDogovorTemplate(model.html, model.application_id, model.template_code);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateuploaded_application_documentRequest requestDto)
        {
            var request = new Domain.Entities.uploaded_application_document
            {
                id = requestDto.id,

                file_id = requestDto.file_id,
                application_document_id = requestDto.application_document_id,
                name = requestDto.name,
                service_document_id = requestDto.service_document_id,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _uploaded_application_documentUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _uploaded_application_documentUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _uploaded_application_documentUseCases.GetOne(id);
            return Ok(response);
        }


        [HttpGet]
        [Route("GetByfile_id")]
        public async Task<IActionResult> GetByfile_id(int file_id)
        {
            var response = await _uploaded_application_documentUseCases.GetByfile_id(file_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByapplication_document_id")]
        public async Task<IActionResult> GetByapplication_document_id(int application_document_id)
        {
            var response = await _uploaded_application_documentUseCases.GetByapplication_document_id(application_document_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("ByApplicationIdAndStepId")]
        public async Task<IActionResult> ByApplicationIdAndStepId(int application_document_id, int app_step_id)
        {
            var response = await _uploaded_application_documentUseCases.ByApplicationIdAndStepId(application_document_id, app_step_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByservice_document_id")]
        public async Task<IActionResult> GetByservice_document_id(int service_document_id)
        {
            var response = await _uploaded_application_documentUseCases.GetByservice_document_id(service_document_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetCustomByApplicationId")]
        public async Task<IActionResult> GetCustomByApplicationId(int application_document_id)
        {
            var response = await _uploaded_application_documentUseCases.GetCustomByApplicationId(application_document_id);
            return Ok(response);
        }

        //[HttpGet]
        //[Route("GetUploadedDocumentsOutcomeToStep")]
        //public async Task<IActionResult> GetUploadedDocumentsOutcomeToStep(int app_id)
        //{
        //    var response = await _uploaded_application_documentUseCases.GetUploadedDocumentsOutcomeToStep(app_id);
        //    return Ok(response);
        //}

        [HttpGet]
        [AllowAnonymous]
        [Route("GetCustomByApplicationIdForCabinet")]
        public async Task<IActionResult> GetCustomByApplicationIdForCabinet(int application_document_id)
        {
            var response = await _uploaded_application_documentUseCases.GetCustomByApplicationId(application_document_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetStepsWithInfo")]
        public async Task<IActionResult> GetStepsWithInfo(int app_id)
        {
            var response = await _uploaded_application_documentUseCases.GetStepsWithInfo(app_id);
            return Ok(response);
        }
        [HttpGet]
        [Route("GetStepDocuments")]
        public async Task<IActionResult> GetStepDocuments(int app_id)
        {
            var response = await _uploaded_application_documentUseCases.GetStepDocuments(app_id);
            return Ok(response);
        }

    }
}
