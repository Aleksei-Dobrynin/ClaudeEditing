using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Repositories;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SecurityEventController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public SecurityEventController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> GetPaginated(int pageSize = 10000, int pageNumber = 1, string orderBy = "event_time", string orderType = "desc")
        {
            var response = await _unitOfWork.SecurityEventRepository.GetPaginated(pageSize, pageNumber, orderBy, orderType);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetById")]
        public async Task<IActionResult> GetById(int id)
        {
            var response = await _unitOfWork.SecurityEventRepository.GetById(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByUserId")]
        public async Task<IActionResult> GetByUserId(string userId)
        {
            var response = await _unitOfWork.SecurityEventRepository.GetByUserId(userId);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByEventType")]
        public async Task<IActionResult> GetByEventType(string eventType)
        {
            var response = await _unitOfWork.SecurityEventRepository.GetByEventType(eventType);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByDateRange")]
        public async Task<IActionResult> GetByDateRange(DateTime startDate, DateTime endDate)
        {
            var response = await _unitOfWork.SecurityEventRepository.GetByDateRange(startDate, endDate);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetUnresolvedEvents")]
        public async Task<IActionResult> GetUnresolvedEvents()
        {
            var response = await _unitOfWork.SecurityEventRepository.GetUnresolvedEvents();
            return Ok(response);
        }

        [HttpPost]
        [Route("ResolveEvent")]
        public async Task<IActionResult> ResolveEvent(int id, string resolutionNotes)
        {
            await _unitOfWork.SecurityEventRepository.UpdateResolution(id, resolutionNotes);
            _unitOfWork.Commit();
            return Ok();
        }
    }
}