using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Application.Models;
using Newtonsoft.Json.Linq;
using System.Web;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class customer_contactController : ControllerBase
    {
        private readonly customer_contactUseCases _customer_contactUseCases;

        public customer_contactController(customer_contactUseCases customer_contactUseCases)
        {
            _customer_contactUseCases = customer_contactUseCases;
        }

        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> Get()
        {
            var response = await _customer_contactUseCases.GetAll();
            return Ok(response);
        }

        [HttpGet]
        [Route("GetPaginated")]
        public async Task<IActionResult> GetPaginated(int pageSize, int pageNumber)
        {
            var response = await _customer_contactUseCases.GetPagniated(pageSize, pageNumber);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Createcustomer_contactRequest requestDto)
        {
            var request = new Domain.Entities.customer_contact
            {
                
                value = requestDto.value,
                type_id = requestDto.type_id,
                customer_id = requestDto.customer_id,
                allow_notification = requestDto.allow_notification,
            };
            var response = await _customer_contactUseCases.Create(request);
            return Ok(response);
        }

        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update(Updatecustomer_contactRequest requestDto)
        {
            var request = new Domain.Entities.customer_contact
            {
                id = requestDto.id,
                
                value = requestDto.value,
                type_id = requestDto.type_id,
                customer_id = requestDto.customer_id,
                allow_notification = requestDto.allow_notification,
            };
            var response = await _customer_contactUseCases.Update(request);
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> GetPaginated(int id)
        {
            var response = await _customer_contactUseCases.Delete(id);
            return Ok(response);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOne(int id)
        {
            var response = await _customer_contactUseCases.GetOne(id);
            return Ok(response);
        }

        
        [HttpGet]
        [Route("GetBytype_id")]
        public async Task<IActionResult> GetBytype_id(int type_id)
        {
            var response = await _customer_contactUseCases.GetBytype_id(type_id);
            return Ok(response);
        }
        
        [HttpGet]
        [Route("GetBycustomer_id")]
        public async Task<IActionResult> GetBycustomer_id(int customer_id)
        {
            var response = await _customer_contactUseCases.GetBycustomer_id(customer_id);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetByNumber")]
        public async Task<IActionResult> GetByNumber(string  value )
        {
            var parseValue = HttpUtility.UrlDecode(value).Replace(" ", "+");
            var response = await _customer_contactUseCases.GetByNumber(parseValue);
            return Ok(response);
        }


    }
}
