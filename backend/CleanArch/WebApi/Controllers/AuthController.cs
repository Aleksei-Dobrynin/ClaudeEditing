using Microsoft.AspNetCore.Mvc;
using WebApi.Dtos;
using Application.UseCases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using AuthLibrary;
using DeviceDetectorNET;
using Domain.Entities;
using System.Net;

namespace WebApi.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthUseCases _authUseCases;
        private readonly UserLoginHistoryUseCases _userLoginHistoryUseCases;


        public AuthController(AuthUseCases authUseCases, UserLoginHistoryUseCases userLoginHistoryUseCases)
        {
            _authUseCases = authUseCases;
            _userLoginHistoryUseCases = userLoginHistoryUseCases;

        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Email and password are required" });
            }
            
            var result = await _authUseCases.Authenticate(request.Username, request.Password);

            if (!result.Success)
            {
                return Unauthorized(new { message = result.Message });
            }

            return Ok(new 
            { 
                token = result.Token,
                userId = result.UserId
            });
        }

        private async Task WriteUserData(string email)
        {
            var userAgentString = Request.Headers["User-Agent"].ToString();
            var deviceDetector = new DeviceDetector(userAgentString);
            deviceDetector.Parse();
            var device = deviceDetector.GetDeviceName() ?? "unknown";
            var clientInfo = deviceDetector.GetClient();
            var browser = clientInfo?.Match != null ? $"{clientInfo.Match.Name} {clientInfo.Match.Version}" : "unknown";
            var osInfo = deviceDetector.GetOs();
            var os = osInfo?.Match != null ? $"{osInfo.Match.Name} {osInfo.Match.Version} {osInfo.Match.Platform}" : "unknown";
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
            var user = await _authUseCases.GetByUserId(email);
            await _userLoginHistoryUseCases.SaveLoginUserData(user.Id, ipAddress, device, browser, os);
        }

        [HttpPost]
        [Route("ChangePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto requestDto)
        {
            var response = await _authUseCases.ChangePassword(requestDto.CurrentPassword, requestDto.NewPassword);
            return Ok(response);
        }

        [HttpPost]
        [Route("GetCurrentUser")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var response = await _authUseCases.GetCurrentUser();
            return Ok(response);
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto requestDto)
        {
            var response = await _authUseCases.ForgotPassword(requestDto.Email);
            return Ok(response);
        }

        [HttpGet]
        [Route("IsSuperAdmin")]
        public async Task<IActionResult> IsSuperAdmin(string username)
        {
            var response = await _authUseCases.IsSuperAdmin(username);
            return Ok(response);
        }

        [HttpGet]
        [Route("GetMyRoles")]
        public async Task<IActionResult> GetMyRoles()
        {
            var response = await _authUseCases.GetMyRoles();
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] LoginRequest model)
        {
            var result = await _authUseCases.Create(model.Username, model.Password);

            return Ok(result);
        }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
