using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ServiceController : ControllerBase
    {
        private readonly ServiceUseCases _serviceUseCases;

        public ServiceController(ServiceUseCases serviceUseCases)
        {
            _serviceUseCases = serviceUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _serviceUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _serviceUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _serviceUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateServiceRequest requestDto)
        {
            var request = new Domain.Entities.Service
            {
                name = requestDto.name,
                short_name = requestDto.short_name,
                code = requestDto.code,
                description = requestDto.description,
                day_count = requestDto.day_count,
                workflow_id = requestDto.workflow_id,
                law_document_id = requestDto.law_document_id,
                price = requestDto.price,
                is_active = requestDto.is_active,
                date_start = requestDto.date_start,
                date_end = requestDto.date_end,
                structure_id = requestDto.structure_id
            };
            var response = await _serviceUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateServiceRequest requestDto)
        {
            var request = new Domain.Entities.Service
            {
                id = requestDto.id,
                name = requestDto.name,
                short_name = requestDto.short_name,
                code = requestDto.code,
                description = requestDto.description,
                day_count = requestDto.day_count,
                workflow_id = requestDto.workflow_id,
                law_document_id = requestDto.law_document_id,
                price = requestDto.price,
                is_active = requestDto.is_active,
                date_start = requestDto.date_start,
                date_end = requestDto.date_end,
                structure_id = requestDto.structure_id
            };
            var response = await _serviceUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _serviceUseCases.Delete(id);
            return Ok();
        }


        [HttpGet]
        [Route("DashboardGetCountServices")]
        public async Task<IActionResult> DashboardGetCountServices(DateTime date_start, DateTime date_end, int structure_id)
        {
            var response = await _serviceUseCases.DashboardGetCountServices(date_start, date_end, structure_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("DashboardGetCountServicesForMyStructure")]
        public async Task<IActionResult> DashboardGetCountServicesForMyStructure(DateTime date_start, DateTime date_end)
        {
            var response = await _serviceUseCases.DashboardGetCountServicesForMyStructure(date_start, date_end);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("DashboardGetAppsByStatusAndStructure")]
        public async Task<IActionResult> DashboardGetAppsByStatusAndStructure(DateTime date_start, DateTime date_end, int structure_id, string? status_name)
        {
            var response = await _serviceUseCases.DashboardGetAppsByStatusAndStructure(date_start, date_end, structure_id, status_name);
            return Ok(response);
        }

        [HttpGet]
        [Route("DashboardGetFinance")]
        public async Task<IActionResult> DashboardGetFinance(DateTime date_start, DateTime date_end, int structure_id)
        {
            var response = await _serviceUseCases.DashboardGetFinance(date_start, date_end, structure_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("DashboardGetPaymentFinance")]
        public async Task<IActionResult> DashboardGetPaymentFinance(DateTime date_start, DateTime date_end, int structure_id)
        {
            var response = await _serviceUseCases.DashboardGetPaymentFinance(date_start, date_end, structure_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("DashboardGetCountTasks")]
        public async Task<IActionResult> DashboardGetCountTasks(DateTime date_start, DateTime date_end, int structure_id)
        {
            var response = await _serviceUseCases.DashboardGetCountTasks(date_start, date_end, structure_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("DashboardGetCountTasksForMyStructure")]
        public async Task<IActionResult> DashboardGetCountTasksForMyStructure(DateTime date_start, DateTime date_end)
        {
            var response = await _serviceUseCases.DashboardGetCountTasksForMyStructure(date_start, date_end);
            return Ok(response);
        }

        [HttpGet]
        [Route("DashboardGetCountUserApplications")]
        public async Task<IActionResult> DashboardGetCountUserApplications(DateTime date_start, DateTime date_end)
        {
            var response = await _serviceUseCases.DashboardGetCountUserApplications(date_start, date_end);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("DashboardGetCountUserApplicationsMyStructure")]
        public async Task<IActionResult> DashboardGetCountUserApplicationsMyStructure(DateTime date_start, DateTime date_end)
        {
            var response = await _serviceUseCases.DashboardGetCountUserApplicationsMyStructure(date_start, date_end);
            return Ok(response);
        }

        [HttpGet]
        [Route("DashboardGetCountObjects")]
        public async Task<IActionResult> DashboardGetCountObjects(int district_id)
        {
            var response = await _serviceUseCases.DashboardGetCountObjects(district_id);
            return Ok(response);
        } 
        
        [HttpGet]
        [Route("DashboardGetCountObjectsMyStructure")]
        public async Task<IActionResult> DashboardGetCountObjectsMyStructure(int district_id)
        {
            var response = await _serviceUseCases.DashboardGetCountObjectsMyStructure(district_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("DashboardGetApplicationCountHour")]
        public async Task<IActionResult> DashboardGetApplicationCountHour(DateTime date_start, DateTime date_end)
        {
            var response = await _serviceUseCases.GetApplicationCountHour(date_start, date_end);
            return Ok(response);
        }     
        
        [HttpGet]
        [Route("DashboardGetApplicationCountHourMyStructure")]
        public async Task<IActionResult> DashboardGetApplicationCountHourMyStructure(DateTime date_start, DateTime date_end)
        {
            var response = await _serviceUseCases.GetApplicationCountHourMyStructure(date_start, date_end);
            return Ok(response);
        }       
        
        [HttpGet]
        [Route("DashboardGetApplicationCountWeek")]
        public async Task<IActionResult> DashboardGetApplicationCountWeek(DateTime date_start, DateTime date_end)
        {
            var response = await _serviceUseCases.GetApplicationCountWeek(date_start, date_end);
            return Ok(response);
        }        
        
        [HttpGet]
        [Route("DashboardGetApplicationCountWeekMyStructure")]
        public async Task<IActionResult> DashboardGetApplicationCountWeekMyStructure(DateTime date_start, DateTime date_end)
        {
            var response = await _serviceUseCases.GetApplicationCountWeekMyStructure(date_start, date_end);
            return Ok(response);
        }

        [HttpGet]
        [Route("DashboardGetArchiveCount")]
        public async Task<IActionResult> DashboardGetArchiveCount(string date_start, string date_end)
        {
            var dateStart = DateTime.Now;
            var dateEnd = DateTime.Now;
            if (!DateTime.TryParse(date_start, out dateStart))
            {
                return BadRequest();
            }
            if (!DateTime.TryParse(date_end, out dateEnd))
            {
                return BadRequest();
            }
            var response = await _serviceUseCases.GetArchiveCount(dateStart, dateEnd);
            return Ok(response);
        }        [HttpGet]
        
        [Route("DashboardGetArchiveCountMyStructure")]
        public async Task<IActionResult> DashboardGetArchiveCountMyStructure(string date_start, string date_end)
        {
            var dateStart = DateTime.Now;
            var dateEnd = DateTime.Now;
            if (!DateTime.TryParse(date_start, out dateStart))
            {
                return BadRequest();
            }
            if (!DateTime.TryParse(date_end, out dateEnd))
            {
                return BadRequest();
            }
            var response = await _serviceUseCases.GetArchiveCountMyStructure(dateStart, dateEnd);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("DashboardGetIssuedAppsRegister")]
        public async Task<IActionResult> DashboardGetIssuedAppsRegister(string date_start, string date_end)
        {
            var dateStart = DateTime.Now;
            var dateEnd = DateTime.Now;
            if (!DateTime.TryParse(date_start, out dateStart))
            {
                return BadRequest();
            }
            if (!DateTime.TryParse(date_end, out dateEnd))
            {
                return BadRequest();
            }

            var response = await _serviceUseCases.DashboardGetIssuedAppsRegister(dateStart, dateEnd);
            return Ok(response);
        }  
        [HttpGet]
        [Route("DashboardGetCountTaskByStructure")]
        public async Task<IActionResult> DashboardGetCountTaskByStructure(string date_start, string date_end)
        {
            var dateStart = DateTime.Now;
            var dateEnd = DateTime.Now;
            if (!DateTime.TryParse(date_start, out dateStart))
            {
                return BadRequest();
            }
            if (!DateTime.TryParse(date_end, out dateEnd))
            {
                return BadRequest();
            }

            var response = await _serviceUseCases.DashboardGetCountTaskByStructure(dateStart, dateEnd);
            return Ok(response);
        }            
        
        [HttpGet]
        [Route("DashboardGetCountBySelectedStructure")]
        public async Task<IActionResult> DashboardGetCountBySelectedStructure(string date_start, string date_end, int structure_id)
        {
            var dateStart = DateTime.Now;
            var dateEnd = DateTime.Now;
            if (!DateTime.TryParse(date_start, out dateStart))
            {
                return BadRequest();
            }
            if (!DateTime.TryParse(date_end, out dateEnd))
            {
                return BadRequest();
            }

            var response = await _serviceUseCases.DashboardGetCountBySelectedStructure(dateStart, dateEnd, structure_id);
            return Ok(response);
        }      
        [HttpGet]
        [Route("DashboardGetRefucalCountBySelectedStructure")]
        public async Task<IActionResult> DashboardGetRefucalCountBySelectedStructure(string date_start, string date_end, int structure_id)
        {
            var dateStart = DateTime.Now;
            var dateEnd = DateTime.Now;
            if (!DateTime.TryParse(date_start, out dateStart))
            {
                return BadRequest();
            }
            if (!DateTime.TryParse(date_end, out dateEnd))
            {
                return BadRequest();
            }

            var response = await _serviceUseCases.DashboardGetRefucalCountBySelectedStructure(dateStart, dateEnd, structure_id);
            return Ok(response);
        }     
        [HttpGet]
        [Route("DashboardGetCountLateBySelectedStructure")]
        public async Task<IActionResult> DashboardGetCountLateBySelectedStructure(string date_start, string date_end, int structure_id)
        {
            var dateStart = DateTime.Now;
            var dateEnd = DateTime.Now;
            if (!DateTime.TryParse(date_start, out dateStart))
            {
                return BadRequest();
            }
            if (!DateTime.TryParse(date_end, out dateEnd))
            {
                return BadRequest();
            }

            var response = await _serviceUseCases.DashboardGetCountLateBySelectedStructure(dateStart, dateEnd, structure_id);
            return Ok(response);
        }     
        [HttpGet]
        [Route("DashboardGetCountLateByStructure")]
        public async Task<IActionResult> DashboardGetCountLateByStructure(string date_start, string date_end)
        {
            var dateStart = DateTime.Now;
            var dateEnd = DateTime.Now;
            if (!DateTime.TryParse(date_start, out dateStart))
            {
                return BadRequest();
            }
            if (!DateTime.TryParse(date_end, out dateEnd))
            {
                return BadRequest();
            }

            var response = await _serviceUseCases.DashboardGetCountLateByStructure(dateStart, dateEnd);
            return Ok(response);
        }    
        [HttpGet]
        [Route("DashboardGetRefucalCountByStructure")]
        public async Task<IActionResult> DashboardGetRefucalCountByStructure(string date_start, string date_end)
        {
            var dateStart = DateTime.Now;
            var dateEnd = DateTime.Now;
            if (!DateTime.TryParse(date_start, out dateStart))
            {
                return BadRequest();
            }
            if (!DateTime.TryParse(date_end, out dateEnd))
            {
                return BadRequest();
            }

            var response = await _serviceUseCases.DashboardGetRefucalCountByStructure(dateStart, dateEnd);
            return Ok(response);
        }
        [HttpGet]
        [Route("DashboardGetEmployeesToDutyPlan")]
        public async Task<IActionResult> DashboardGetEmployeesToDutyPlan(string date_start, string date_end)
        {
            var dateStart = DateTime.Now;
            var dateEnd = DateTime.Now;
            if (!DateTime.TryParse(date_start, out dateStart))
            {
                return BadRequest();
            }
            if (!DateTime.TryParse(date_end, out dateEnd))
            {
                return BadRequest();
            }
            var response = await _serviceUseCases.DashboardGetEmployeesToDutyPlan(dateStart, dateEnd);
            return Ok(response);
        }
        [HttpGet]
        [Route("DashboardGetAppsFromRegister")]
        public async Task<IActionResult> DashboardGetAppsFromRegister(string date_start, string date_end)
        {
            var dateStart = DateTime.Now;
            var dateEnd = DateTime.Now;
            if (!DateTime.TryParse(date_start, out dateStart))
            {
                return BadRequest();
            }
            if (!DateTime.TryParse(date_end, out dateEnd))
            {
                return BadRequest();
            }
            var response = await _serviceUseCases.DashboardGetAppsFromRegister(dateStart, dateEnd);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetAppCountDashboardByStructure")]
        public async Task<IActionResult> GetAppCountDashboardByStructure(string date_start, string date_end, int structure_id)
        {
            var dateStart = DateTime.Now;
            var dateEnd = DateTime.Now;
            if (!DateTime.TryParse(date_start, out dateStart))
            {
                return BadRequest();
            }
            if (!DateTime.TryParse(date_end, out dateEnd))
            {
                return BadRequest();
            }
            var response = await _serviceUseCases.GetAppCountDashboardByStructure(dateStart, dateEnd, structure_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetApplicationsWithCoords")]
        public async Task<IActionResult> GetApplicationsWithCoords(DateTime date_start, DateTime date_end, int service_id, string? status_code, int tag_id)
        {
            var response = await _serviceUseCases.GetApplicationsWithCoords(date_start, date_end, service_id, status_code, tag_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetApplicationsWithCoordsByHeadStructure")]
        public async Task<IActionResult> GetApplicationsWithCoordsByHeadStructure(DateTime date_start, DateTime date_end, int service_id, string? status_code, int tag_id)
        {
            var response = await _serviceUseCases.GetApplicationsWithCoordsByHeadStructure(date_start, date_end, service_id, status_code, tag_id);
            return Ok(response);
        }
        [HttpGet]
        [Route("DashboardGetAppCount")]
        public async Task<IActionResult> DashboardGetAppCount(DateTime date_start, DateTime date_end, int service_id, int status_id)
        {
            var response = await _serviceUseCases.DashboardGetAppCount(date_start, date_end, service_id, status_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("DashboardGetAppCountMyStructure")]
        public async Task<IActionResult> DashboardGetAppCountMyStructure(DateTime date_start, DateTime date_end, int service_id, int status_id)
        {
            var response = await _serviceUseCases.DashboardGetAppCountMyStructure(date_start, date_end, service_id, status_id);
            return Ok(response);
        }
        [HttpGet]
        [Route("GetForFinanceInvoice")]
        public async Task<IActionResult> GetForFinanceInvoice(DateTime date_start, DateTime date_end)
        {
            var response = await _serviceUseCases.GetForFinanceInvoice(date_start, date_end);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetApplicationsCategoryCount")]
        public async Task<IActionResult> GetApplicationsCategoryCount(DateTime date_start, DateTime date_end, int? district_id, [FromQuery] string is_paid)
        {
            bool? isPaidParsed = is_paid?.ToLower() switch
            {
                "true" => true,
                "false" => false,
                "null" or null => null,
                _ => null
            };
            var response = await _serviceUseCases.GetApplicationsCategoryCount(date_start, date_end, district_id, isPaidParsed);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetApplicationsCategoryCountForMyStructure")]
        public async Task<IActionResult> GetApplicationsCategoryCountForMyStructure(DateTime date_start, DateTime date_end, int? district_id, [FromQuery] string is_paid)
        {
            bool? isPaidParsed = is_paid?.ToLower() switch
            {
                "true" => true,
                "false" => false,
                "null" or null => null,
                _ => null
            };
            var response = await _serviceUseCases.GetApplicationsCategoryCountForMyStructure(date_start, date_end, district_id, isPaidParsed);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetApplicationsCountForMyStructure")]
        public async Task<IActionResult> GetApplicationsCountForMyStructure([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var response = await _serviceUseCases.GetApplicationsCountForMyStructure(startDate, endDate);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetMyStructure")]
        public async Task<IActionResult> GetMyStructure()
        {
            var response = await _serviceUseCases.GetMyStructure();
            return Ok(response);
        }
    }
    
}
