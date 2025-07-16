using Application.UseCases;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using static WebApi.Dtos.telegram_questions;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class telegram_questionsController : ControllerBase
    {
        private readonly telegram_questionsUseCase _telegram_questionsUseCases;

        public telegram_questionsController(telegram_questionsUseCase telegram_questionsUseCases)
        {
            _telegram_questionsUseCases = telegram_questionsUseCases;
        }


        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _telegram_questionsUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _telegram_questionsUseCases.GetById(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByIdSubject")]
        public async Task<IActionResult> GetByIdSubject(int id)
        {
            var response = await _telegram_questionsUseCases.GetByIdSubject(id);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create([FromForm] Createtelegram_questionsRequest requestDto)
        {
            var files = Request.Form.Files;
            var fileList = new List<Domain.Entities.File>();

            var request = new Domain.Entities.telegram_questions
            {
                name = requestDto.name,
                idSubject = requestDto.idSubject,
                answer = requestDto.answer,
                name_kg = requestDto.name_kg,
                answer_kg = requestDto.answer_kg,
            };

            foreach (var singleFile in files)
            {
                    using var ms = new MemoryStream();
                    singleFile?.CopyTo(ms);
                    byte[] fileBytes = ms.ToArray(); 

                    var file = new Domain.Entities.File
                    {
                        body = fileBytes,
                        name = singleFile.FileName,
                    };

                    fileList.Add(file);
            }

                 request.document = fileList;
                var response = await _telegram_questionsUseCases.Create(request);
            return ActionResultHelper.FromResult(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromForm] Updatetelegram_questionsRequest requestDto)
        {
            var files = Request.Form.Files;
            var fileList = new List<Domain.Entities.File>();
            var request = new Domain.Entities.telegram_questions
            {
                id = requestDto.id,
                name = requestDto.name,
                idSubject = requestDto.idSubject,
                answer = requestDto.answer,
                name_kg = requestDto.name_kg,
                answer_kg = requestDto.answer_kg,
                document = new List<Domain.Entities.File>()
            };


            var documentIds = new List<int>();

            if (Request.Form.ContainsKey("document.id"))
            {
                var oldDocIds = Request.Form["document.id"];
                foreach (var id in oldDocIds)
                {
                    if (int.TryParse(id, out int documentId)) 
                    {
                        documentIds.Add(documentId);
                    }
                }
            }


           if(files.Count > 0)
            {
                foreach (var singleFile in files)
                {
                    using var ms = new MemoryStream();
                    singleFile?.CopyTo(ms);
                    byte[] fileBytes = ms.ToArray();

                    var file = new Domain.Entities.File
                    {
                        body = fileBytes,
                        name = singleFile.FileName,
                    };

                    request.document.Add(file);
                }
            }

            var response = await _telegram_questionsUseCases.Update(request, documentIds);
            return Ok(response);
        }
        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _telegram_questionsUseCases.Delete(id);

            return Ok();
        }
    }
}
