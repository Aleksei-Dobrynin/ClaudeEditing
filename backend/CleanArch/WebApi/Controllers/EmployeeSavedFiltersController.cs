using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeeSavedFiltersController : ControllerBase
    {
        private readonly EmployeeSavedFiltersUseCases _employeesavedfiltersUseCases;

        public EmployeeSavedFiltersController(EmployeeSavedFiltersUseCases employeesavedfiltersUseCases)
        {
            _employeesavedfiltersUseCases = employeesavedfiltersUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _employeesavedfiltersUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _employeesavedfiltersUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByEmployeeId")]
        public async Task<IActionResult> GetByEmployeeId()
        {
            var response = await _employeesavedfiltersUseCases.GetByEmployeeId();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _employeesavedfiltersUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateEmployeeSavedFiltersRequest requestDto)
        {
            var request = new Domain.Entities.EmployeeSavedFilters
            {
                //employee_id = requestDto.employee_id,
                filter_name = requestDto.filter_name,
                is_default = requestDto.is_default,
                is_active = requestDto.is_active,
                page_size = requestDto.page_size,
                page_number = requestDto.page_number,
                sort_by = requestDto.sort_by,
                sort_type = requestDto.sort_type,
                pin = requestDto.pin,
                customer_name = requestDto.customer_name,
                common_filter = requestDto.common_filter,
                address = requestDto.address,
                number = requestDto.number,
                incoming_numbers = requestDto.incoming_numbers,
                outgoing_numbers = requestDto.outgoing_numbers,
                date_start = requestDto.date_start,
                date_end = requestDto.date_end,
                dashboard_date_start = requestDto.dashboard_date_start,
                dashboard_date_end = requestDto.dashboard_date_end,
                service_ids = requestDto.service_ids,
                status_ids = requestDto.status_ids,
                structure_ids = requestDto.structure_ids,
                app_ids = requestDto.app_ids,
                district_id = requestDto.district_id,
                tag_id = requestDto.tag_id,
                filter_employee_id = requestDto.filter_employee_id,
                journals_id = requestDto.journals_id,
                employee_arch_id = requestDto.employee_arch_id,
                issued_employee_id = requestDto.issued_employee_id,
                tunduk_district_id = requestDto.tunduk_district_id,
                tunduk_address_unit_id = requestDto.tunduk_address_unit_id,
                tunduk_street_id = requestDto.tunduk_street_id,
                deadline_day = requestDto.deadline_day,
                total_sum_from = requestDto.total_sum_from,
                total_sum_to = requestDto.total_sum_to,
                total_payed_from = requestDto.total_payed_from,
                total_payed_to = requestDto.total_payed_to,
                is_expired = requestDto.is_expired,
                is_my_org_application = requestDto.is_my_org_application,
                without_assigned_employee = requestDto.without_assigned_employee,
                use_common = requestDto.use_common,
                only_count = requestDto.only_count,
                is_journal = requestDto.is_journal,
                is_paid = requestDto.is_paid,
                last_used_at = requestDto.last_used_at,
                usage_count = requestDto.usage_count
            };
            var response = await _employeesavedfiltersUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateEmployeeSavedFiltersRequest requestDto)
        {
            var request = new Domain.Entities.EmployeeSavedFilters
            {
                id = requestDto.id,
                //employee_id = requestDto.employee_id,
                filter_name = requestDto.filter_name,
                is_default = requestDto.is_default,
                is_active = requestDto.is_active,
                page_size = requestDto.page_size,
                page_number = requestDto.page_number,
                sort_by = requestDto.sort_by,
                sort_type = requestDto.sort_type,
                pin = requestDto.pin,
                customer_name = requestDto.customer_name,
                common_filter = requestDto.common_filter,
                address = requestDto.address,
                number = requestDto.number,
                incoming_numbers = requestDto.incoming_numbers,
                outgoing_numbers = requestDto.outgoing_numbers,
                date_start = requestDto.date_start,
                date_end = requestDto.date_end,
                dashboard_date_start = requestDto.dashboard_date_start,
                dashboard_date_end = requestDto.dashboard_date_end,
                service_ids = requestDto.service_ids,
                status_ids = requestDto.status_ids,
                structure_ids = requestDto.structure_ids,
                app_ids = requestDto.app_ids,
                district_id = requestDto.district_id,
                tag_id = requestDto.tag_id,
                filter_employee_id = requestDto.filter_employee_id,
                journals_id = requestDto.journals_id,
                employee_arch_id = requestDto.employee_arch_id,
                issued_employee_id = requestDto.issued_employee_id,
                tunduk_district_id = requestDto.tunduk_district_id,
                tunduk_address_unit_id = requestDto.tunduk_address_unit_id,
                tunduk_street_id = requestDto.tunduk_street_id,
                deadline_day = requestDto.deadline_day,
                total_sum_from = requestDto.total_sum_from,
                total_sum_to = requestDto.total_sum_to,
                total_payed_from = requestDto.total_payed_from,
                total_payed_to = requestDto.total_payed_to,
                is_expired = requestDto.is_expired,
                is_my_org_application = requestDto.is_my_org_application,
                without_assigned_employee = requestDto.without_assigned_employee,
                use_common = requestDto.use_common,
                only_count = requestDto.only_count,
                is_journal = requestDto.is_journal,
                is_paid = requestDto.is_paid,
                last_used_at = requestDto.last_used_at,
                usage_count = requestDto.usage_count
            };
            var response = await _employeesavedfiltersUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _employeesavedfiltersUseCases.Delete(id);
            return Ok();
        }
    }
}