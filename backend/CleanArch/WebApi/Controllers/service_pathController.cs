using Application.Models;
using Application.UseCases;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class service_pathController : ControllerBase
    {
        private readonly service_pathUseCases _service_pathUseCases;
        private readonly ServicePathBulkUseCase _bulkUseCase;

        public service_pathController(
            service_pathUseCases service_pathUseCases,
            ServicePathBulkUseCase bulkUseCase) 
        {
            _service_pathUseCases = service_pathUseCases;
            _bulkUseCase = bulkUseCase; 
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _service_pathUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _service_pathUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createservice_pathRequest requestDto)
        {
            var request = new Domain.Entities.service_path
            {
                
                updated_by = requestDto.updated_by,
                service_id = requestDto.service_id,
                name = requestDto.name,
                description = requestDto.description,
                is_default = requestDto.is_default,
                is_active = requestDto.is_active,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
            };
            var response = await _service_pathUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updateservice_pathRequest requestDto)
        {
            var request = new Domain.Entities.service_path
            {
                id = requestDto.id,
                
                updated_by = requestDto.updated_by,
                service_id = requestDto.service_id,
                name = requestDto.name,
                description = requestDto.description,
                is_default = requestDto.is_default,
                is_active = requestDto.is_active,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
            };
            var response = await _service_pathUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _service_pathUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _service_pathUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetByservice_id")]
        public async Task<IActionResult> GetByservice_id(int service_id)
        {
            var response = await _service_pathUseCases.GetByservice_id(service_id);
            return Ok(response);
        }
        
        [HttpPost]
        [Route("BulkSave")]
        public async Task<IActionResult> BulkSave(BulkSaveServicePathRequest request)
        {
            try
            {
                var response = await _bulkUseCase.BulkSave(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpGet]
        [Route("LoadWithChildren/{id:int}")]
        public async Task<IActionResult> LoadWithChildren(int id)
        {
            try
            {
                var response = await _bulkUseCase.LoadWithChildren(id);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }


        /// <summary>
        /// ѕолучить услугу с активным путем, шагами, документами и подписантами
        /// Ётот endpoint возвращает полную иерархию дл€ отображени€ на фронтенде
        /// </summary>
        /// <param name="serviceId">ID услуги</param>
        /// <returns>”слуга с полной структурой: путь > шаги > документы > подписанты</returns>
        [HttpGet]
        [Route("GetServiceWithPathAndSigners")]
        public async Task<IActionResult> GetServiceWithPathAndSigners(int serviceId)
        {
            try
            {
                var response = await _service_pathUseCases.GetServiceWithPathAndSigners(serviceId);
        
                if (response == null)
                {
                    return NotFound(new { message = $"Service with id {serviceId} not found or inactive" });
                }
        
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }

        /// <summary>
        /// ѕолучить все активные услуги с пут€ми, шагами, документами и подписантами
        /// </summary>
        /// <returns>—писок всех активных услуг с полной структурой</returns>
        [HttpGet]
        [Route("GetAllServicesWithPathsAndSigners")]
        public async Task<IActionResult> GetAllServicesWithPathsAndSigners()
        {
            try
            {
                var response = await _service_pathUseCases.GetAllServicesWithPathsAndSigners();
                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", error = ex.Message });
            }
        }
    }
}
