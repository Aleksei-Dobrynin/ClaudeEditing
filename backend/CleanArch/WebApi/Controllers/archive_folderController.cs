using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class archive_folderController : ControllerBase
    {
        private readonly archive_folderUseCases _archive_folderUseCases;

        public archive_folderController(archive_folderUseCases archive_folderUseCases)
        {
            _archive_folderUseCases = archive_folderUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _archive_folderUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _archive_folderUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createarchive_folderRequest requestDto)
        {
            var request = new Domain.Entities.archive_folder
            {
                
                archive_folder_name = requestDto.archive_folder_name,
                dutyplan_object_id = requestDto.dutyplan_object_id,
                folder_location = requestDto.folder_location,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _archive_folderUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatearchive_folderRequest requestDto)
        {
            var request = new Domain.Entities.archive_folder
            {
                id = requestDto.id,
                
                archive_folder_name = requestDto.archive_folder_name,
                dutyplan_object_id = requestDto.dutyplan_object_id,
                folder_location = requestDto.folder_location,
                created_at = requestDto.created_at,
                updated_at = requestDto.updated_at,
                created_by = requestDto.created_by,
                updated_by = requestDto.updated_by,
            };
            var response = await _archive_folderUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var response = await _archive_folderUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _archive_folderUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetBydutyplan_object_id")]
        public async Task<IActionResult> GetBydutyplan_object_id(int dutyplan_object_id)
        {
            var response = await _archive_folderUseCases.GetBydutyplan_object_id(dutyplan_object_id);
            return Ok(response);
        }
        

    }
}
