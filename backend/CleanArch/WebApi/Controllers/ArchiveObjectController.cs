using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Domain.Entities;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ArchiveObjectController : ControllerBase
    {
        private readonly ArchiveObjectUseCases _archiveObjectUseCases;

        public ArchiveObjectController(ArchiveObjectUseCases archiveObjectUseCases)
        {
            _archiveObjectUseCases = archiveObjectUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _archiveObjectUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet("Search")]
        public async Task<IActionResult> Search(
            [FromQuery] string? number,
            [FromQuery] double? latitude,
            [FromQuery] double? longitude,
            [FromQuery] double? radius)
        {
            var response = await _archiveObjectUseCases.Search(number, latitude, longitude, radius);
            return Ok(response);
        }

        [HttpGet]
        [Route("SearchByNumber")]
        public async Task<IActionResult> SearchByNumber(string? number)
        {
            var response = await _archiveObjectUseCases.SearchByNumber(number);
            return Ok(response);
        }
        [HttpGet]
        [Route("GetArchiveObjectsFromApplication")]
        public async Task<IActionResult> GetArchiveObjectsFromApplication()
        {
            var response = await _archiveObjectUseCases.GetArchiveObjectsFromApplication();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _archiveObjectUseCases.GetOneByID(id);
            return Ok(response);
        }
        

        [HttpGet]
        [Route("GetOneByProcessId")]
        public async Task<IActionResult> GetOneByProcessId(int process_id)
        {
            var response = await _archiveObjectUseCases.GetOneByProcessId(process_id);
            return Ok(response);
        }

        [HttpPost]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(ArchiveObjectFilter filter)
        {
            var response = await _archiveObjectUseCases.GetPagniated(filter);
            return Ok(response);
        }

        [HttpPost]
        [Route("DivideArchiveObject")]
        public async Task<IActionResult> DivideArchiveObject(DivideArchiveObjectDto filter)
        {
            var response = await _archiveObjectUseCases.DivideArchiveObject(filter);
            return Ok(response);
        }

        [HttpPost]
        [Route("CombineArchiveObjects")]
        public async Task<IActionResult> CombineArchiveObjects(CombineArchiveObjects data)
        {
            var response = await _archiveObjectUseCases.CombineArchiveObjects(data);
            return Ok(response);
        }


        [HttpPost]
        [Route("SetDutyNumberToDuty")]
        public async Task<IActionResult> SetDutyNumberToDuty(SetDutyNumberToDutyReq req)
        {
            var response = await _archiveObjectUseCases.SetDutyNumberToDuty(req.from_duty_id, req.to_duty_id);
            return Ok(response);
        }
        public class SetDutyNumberToDutyReq
        {
            public int from_duty_id { get; set; }
            public int to_duty_id { get; set; }
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateArchiveObjectRequest requestDto)
        {
            var request = new Domain.Entities.ArchiveObject
            {
                doc_number = requestDto.doc_number,
                address = requestDto.address,
                customer = requestDto.customer,
                latitude = requestDto.latitude,
                longitude = requestDto.longitude,
                layer = requestDto.layer,
                description = requestDto.description,
                date_setplan = requestDto.date_setplan,
                status_dutyplan_object_id = requestDto.status_dutyplan_object_id,
                quantity_folder = requestDto.quantity_folder,
                parent_id = requestDto.parent_id,
            };

            var customers_ArchObj = requestDto.customers_for_archive_object.Select(x =>
           new Domain.Entities.customers_for_archive_object
           {
               id = x.id,
               address = x.address,
               full_name = x.full_name,
               pin = x.pin,
               is_organization = x.is_organization,
               description = x.description,
               dp_outgoing_number = x.dp_outgoing_number
           }).ToList();
            request.customers_for_archive_object = customers_ArchObj;

            var response = await _archiveObjectUseCases.Create(request);
            return Ok(response);
        }

        [HttpPost]
        [Route("CreateWithFolder")]
        public async Task<IActionResult> CreateWithFolder(CreateArchiveObjectRequest requestDto)
        {
            var request = new Domain.Entities.ArchiveObject
            {
                doc_number = requestDto.doc_number,
                address = requestDto.address,
                customer = requestDto.customer,
                latitude = requestDto.latitude,
                longitude = requestDto.longitude,
                layer = requestDto.layer,
                description = requestDto.description,
                date_setplan = requestDto.date_setplan,
                status_dutyplan_object_id = requestDto.status_dutyplan_object_id,
                quantity_folder = requestDto.quantity_folder,
                parent_id = requestDto.parent_id,
            };

            var response = await _archiveObjectUseCases.CreateWithFolder(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateArchiveObjectRequest requestDto)
        {
            var request = new Domain.Entities.ArchiveObject
            {
                id = requestDto.id,
                doc_number = requestDto.doc_number,
                address = requestDto.address,
                customer = requestDto.customer,
                latitude = requestDto.latitude,
                longitude = requestDto.longitude,
                layer = requestDto.layer,
                description = requestDto.description,
                date_setplan = requestDto.date_setplan,
                status_dutyplan_object_id = requestDto.status_dutyplan_object_id,
                quantity_folder = requestDto.quantity_folder
            };

            var customers_ArchObj = requestDto.customers_for_archive_object.Select(x =>
              new Domain.Entities.customers_for_archive_object
              {
                  id = x.id,
                  address = x.address,
                  full_name = x.full_name,
                  pin = x.pin,
                  is_organization = x.is_organization,
                  description = x.description,
                  dp_outgoing_number = x.dp_outgoing_number
              }).ToList();
            request.customers_for_archive_object = customers_ArchObj;

            var response = await _archiveObjectUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _archiveObjectUseCases.Delete(id);
            return Ok();
        }
    }
}