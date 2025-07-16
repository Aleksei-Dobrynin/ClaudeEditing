using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HistoryTableController : ControllerBase
    {
        private readonly HistoryTableUseCases _historyTableUseCases;

        public HistoryTableController(HistoryTableUseCases customerUseCases)
        {
            _historyTableUseCases = customerUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _historyTableUseCases.GetAll();
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetByApplication")]
        public async Task<IActionResult> GetByApplication(int application_id, string? date_start, string? date_end, int employee_id)
        {
            DateTime dateStart = DateTime.Now;
            DateTime? hasDateStart;
            DateTime dateEnd = DateTime.Now;
            DateTime? hasDateEnd;
            if (!DateTime.TryParse(date_start, out dateStart))
            {
                hasDateStart = null;
            }
            else
            {
                hasDateStart = dateStart;
            }
            if (!DateTime.TryParse(date_end, out dateEnd))
            {
                hasDateEnd = null;
            }
            else
            {
                hasDateEnd = dateEnd;
            }
            var response = await _historyTableUseCases.GetByApplication(application_id, hasDateStart, hasDateEnd, employee_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _historyTableUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _historyTableUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }
    }
}
