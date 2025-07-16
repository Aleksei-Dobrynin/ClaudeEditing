using Application.UseCases;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using static WebApi.Dtos.CustomSubscribtion;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CustomSubscribtionController : ControllerBase
    {
        private readonly CustomSubscribtionUseCase _CustomSubscribtionUseCase;

        public CustomSubscribtionController(CustomSubscribtionUseCase CustomSubscribtionUseCase)
        {
            _CustomSubscribtionUseCase = CustomSubscribtionUseCase;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var response = await _CustomSubscribtionUseCase.GetAll();
            return Ok(response);
        }
        [HttpGet]
        [Route("GetByIdEmployee")]
        public async Task<IActionResult> GetByIdEmployee(int id)
        {
            var response = await _CustomSubscribtionUseCase.GetByIdEmployee(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _CustomSubscribtionUseCase.GetOneById(id);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _CustomSubscribtionUseCase.Delete(id);
            return Ok();
        }



        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create([FromBody] CreateCustomSubscribtionRequest requestDto)
        {
            var request = new Domain.Entities.CustomSubscribtion
            {
                idSubscriberType = requestDto.idSubscriberType,
                idSchedule = requestDto.idSchedule,
                idRepeatType = requestDto.idRepeatType,
                sendEmpty = requestDto.sendEmpty,
                timeStart = requestDto.timeStart,
                timeEnd = requestDto.timeEnd,
                monday = requestDto.monday,
                tuesday = requestDto.tuesday,
                wednesday = requestDto.wednesday,
                thursday = requestDto.thursday,
                friday = requestDto.friday,
                saturday = requestDto.saturday,
                sunday = requestDto.sunday,
                dateOfMonth = requestDto.dateOfMonth,
                weekOfMonth = requestDto.weekOfMonth,
                isActive = requestDto.isActive,
                idDocument = requestDto.idDocument,
                activeDateStart = requestDto.activeDateStart,
                activeDateEnd = requestDto.activeDateEnd,
                body = requestDto.body,
                title = requestDto.title,
                idEmployee = requestDto.idEmployee,
                idStructurePost = requestDto.idStructurePost
            };

            var requestSubscriptionContactType = new Domain.Entities.SubscribtionContactType
            {
                idTypeContact = requestDto.SubscribtionContactType.idTypeContact
            };

            var response = await _CustomSubscribtionUseCase.Create(request, requestSubscriptionContactType);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateCustomSubscribtionRequest model)
        {
            var request = new Domain.Entities.CustomSubscribtion
            {
                id = model.id,
                idSubscriberType = model.idSubscriberType,
                idSchedule = model.idSchedule,
                idRepeatType = model.idRepeatType,
                sendEmpty = model.sendEmpty,
                timeStart = model.timeStart,
                timeEnd = model.timeEnd,
                monday = model.monday,
                tuesday = model.tuesday,
                wednesday = model.wednesday,
                thursday = model.thursday,
                friday = model.friday,
                saturday = model.saturday,
                sunday = model.sunday,
                dateOfMonth = model.dateOfMonth,
                weekOfMonth = model.weekOfMonth,
                isActive = model.isActive,
                idDocument = model.idDocument,
                activeDateStart = model.activeDateStart,
                activeDateEnd = model.activeDateEnd,
                body = model.body,
                title = model.title,
                idEmployee = model.idEmployee,
                idStructurePost = model.idStructurePost
            };
            
            var requestSubscriptionContactType = new Domain.Entities.SubscribtionContactType
            {
                idTypeContact = model.SubscribtionContactType.idTypeContact
            };

            var response = await _CustomSubscribtionUseCase.Update(request, requestSubscriptionContactType);
             return Ok(response);
        }

        [HttpGet]
        [Route("GetByidSubscriberType")]
        public async Task<IActionResult> GetByidSubscriberType(int idSubscriberType)
        {
            var response =  await _CustomSubscribtionUseCase.GetByidSubscriberType(idSubscriberType);
            return Ok(response);
        }
        [HttpGet]
        [Route("GetByidSchedule")]
        public async Task<IActionResult> GetByidSchedule(int idSchedule)
        {
            var response =  await _CustomSubscribtionUseCase.GetByidSchedule(idSchedule);
            return Ok(response);
        }
        [HttpGet]
        [Route("GetByidRepeatType")]
        public async Task<IActionResult> GetByidRepeatType(int idRepeatType)
        {
            var response = await _CustomSubscribtionUseCase.GetByidRepeatType(idRepeatType);
            return Ok(response);
        }
        [HttpGet]
        [Route("GetByidDocument")]
        public async Task<IActionResult> GetByidDocument(int idDocument)
        {
            var response = await _CustomSubscribtionUseCase.GetByidDocument(idDocument);
            return Ok(response);
        }
        [HttpGet]
        [Route("GetByidAutoChannel")]
        public async Task<IActionResult> GetByidAutoChannel(int idAutoChannel)
        {
            var response = await _CustomSubscribtionUseCase.GetByidAutoChannel(idAutoChannel);
            return Ok(response);
        }
    }
}
