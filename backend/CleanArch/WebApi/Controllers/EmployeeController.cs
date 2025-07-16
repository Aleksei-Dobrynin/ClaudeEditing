using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeUseCases _employeeUseCases;
        private readonly employee_contactUseCases employee_ContactUseCases;
        private readonly AuthUseCases authUseCases;

        public EmployeeController(EmployeeUseCases employeeUseCases, employee_contactUseCases employee_ContactUseCases, AuthUseCases authUseCases)
        {
            _employeeUseCases = employeeUseCases;
            this.employee_ContactUseCases = employee_ContactUseCases;
            this.authUseCases = authUseCases;
        }


        [HttpGet]
        [Route("getContact")]
        public async Task<IActionResult> GetContact(int id)
        {
            var contacts = await employee_ContactUseCases.GetByIDEmployee(id);
            contacts = contacts.Where(x => x.allow_notification == true).ToList();

            var dict = new Dictionary<string, object>();
            var telegram = contacts.FirstOrDefault(x => x.type_code == "telegram");
            if (telegram != null)
            {
                dict["telegram"] = telegram.value;
            }
            var sms = contacts.FirstOrDefault(x => x.type_code == "sms");
            if (sms != null)
            {
                dict["sms"] = sms.value;
            }
            var emp = await _employeeUseCases.GetOneByID(id);
            var user = await authUseCases.GetByUserId(emp.user_id);
            dict["email"] = emp.email;

            return Ok(dict);
        }


        [HttpPost]
        [Route("createUser")]
        public async Task<IActionResult> CreateUser(EmployeeID requestDto)
        {
            var id = requestDto.id;
            var email = requestDto.email;
            await _employeeUseCases.CreateUser(id, email);
            return Ok();
        }

        public class EmployeeID
        {
            public int id { get; set; }
            public string email { get; set; }
        }


        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _employeeUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetAllRegister")]
        public async Task<IActionResult> GetAllRegister()
        {
            var response = await _employeeUseCases.GetAllRegister();
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetOneByUserId")]
        public async Task<IActionResult> GetOneByUserId(string email)
        {
            var response = await _employeeUseCases.GetAll();
            return Ok(response.FirstOrDefault(x => x.email == email));
        }

        [HttpGet]
        [Route("GetByUserId")]
        public async Task<IActionResult> GetByUserId(string userId)
        {
            var response = await _employeeUseCases.GetByUserId(userId);
            return Ok(response);
        }
        [HttpGet]
        [Route("GetByApplicationId")]
        public async Task<IActionResult> GetByApplicationId(int application_id)
        {
            var response = await _employeeUseCases.GetByApplicationId(application_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetOneById")]
        public async Task<IActionResult> GetOneById(int id)
        {
            var response = await _employeeUseCases.GetOneByID(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _employeeUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetUser")]
        public async Task<IActionResult> GetUser()
        {
            var responce = await _employeeUseCases.GetUser();
            return Ok(responce);
        }

        [HttpGet]
        [Route("GetDashboardInfo")]
        public async Task<IActionResult> GetDashboardInfo()
        {
            var responce = await _employeeUseCases.GetInfoDashboard();
            return Ok(responce);
        }

        [HttpGet]
        [Route("GetEmployeeDashboardInfo")]
        public async Task<IActionResult> GetEmployeeDashboardInfo()
        {
            var responce = await _employeeUseCases.GetEmployeeDashboardInfo();
            return Ok(responce);
        }

        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create(CreateEmployeeRequest requestDto)
        {
            var request = new Domain.Entities.Employee
            {
                last_name = requestDto.last_name,
                first_name = requestDto.first_name,
                second_name = requestDto.second_name,
                pin = requestDto.pin,
                remote_id = requestDto.remote_id,
                user_id = requestDto.user_id,
                email = requestDto.email,
                telegram = requestDto.telegram
            };
            var response = await _employeeUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("Update")]
        public async Task<IActionResult> Update(UpdateEmployeeRequest requestDto)
        {
            var request = new Domain.Entities.Employee
            {
                id = requestDto.id,
                last_name = requestDto.last_name,
                first_name = requestDto.first_name,
                second_name = requestDto.second_name,
                pin = requestDto.pin,
                remote_id = requestDto.remote_id,
                user_id = requestDto.user_id,
                email = requestDto.email,
                telegram = requestDto.telegram
            };
            var response = await _employeeUseCases.Update(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("UpdateInitials")]
        public async Task<IActionResult> UpdateInitials(UpdateInitialsEmployeeRequest requestDto)
        {
            var request = new Domain.Entities.EmployeeInitials
            {
                id = requestDto.id,
                last_name = requestDto.last_name,
                first_name = requestDto.first_name,
                second_name = requestDto.second_name,
                pin = requestDto.pin
            };
            var response = await _employeeUseCases.UpdateInitials(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("Delete")]
        public async Task<IActionResult> Delete(int id)
        {
            await _employeeUseCases.Delete(id);
            return Ok();
        }
        [HttpPost]
        [Route("GetEmployeeByToken")]
        public async Task<IActionResult> GetEmployeeByToken()
        {
            
            var response =  await _employeeUseCases.GetEmployeeByToken();
            return Ok(response);
        }

        
    }
}
