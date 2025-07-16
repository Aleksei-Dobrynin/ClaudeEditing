using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Repositories;
using Domain.Entities;

namespace AuthLibrary
{
    public class AuthService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;
        private readonly IUserLoginHistoryRepository _userLoginHistoryRepository;
        private const int MAX_FAILED_ATTEMPTS = 5;
        private const int LOCKOUT_MINUTES = 30;

        public AuthService(IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IUserLoginHistoryRepository userLoginHistoryRepository)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));

            var serviceProvider = CreateServiceProvider();
            _userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();
            _signInManager = serviceProvider.GetRequiredService<SignInManager<IdentityUser>>();
            _httpContextAccessor = httpContextAccessor;
            _userLoginHistoryRepository = userLoginHistoryRepository;
        }

        private ServiceProvider CreateServiceProvider()
        {
            var services = new ServiceCollection();

            services.AddLogging();

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(_configuration.GetConnectionString("AuthConnection")));

            services.AddIdentity<IdentityUser, IdentityRole>(options =>
                {
                    options.Password.RequiredLength = 1;
                    options.Password.RequireDigit = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireNonAlphanumeric = false;
                })
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            return services.BuildServiceProvider();
        }

        public async Task<AuthResult> Authenticate(string email, string password)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    return new AuthResult { Success = false, Message = "User not found" };
                }
                
                var loginHistory = await _userLoginHistoryRepository.GetRecentByUserId(user.Id);
                int failedAttempts = loginHistory.Count(x => !x.success && x.created_at > DateTime.Now.AddMinutes(-LOCKOUT_MINUTES));

                if (failedAttempts >= MAX_FAILED_ATTEMPTS)
                {
                    await RecordLoginAttempt(user.Id, false, "Account locked due to too many failed attempts");
                    return new AuthResult
                    {
                        Success = false,
                        Message = "Account temporarily locked. Try again later."
                    };
                }

                // Verify password using Identity
                if (await _userManager.CheckPasswordAsync(user, password))
                {
                    // Generate and return JWT token
                    var token = GenerateJwtToken(user);
                    await RecordLoginAttempt(user.Id, true, "Login successful");

                    return new AuthResult
                    {
                        Success = true,
                        Token = token,
                        UserId = user.Id,
                        Message = "Login successful"
                    };
                }
                else
                {
                    await RecordLoginAttempt(user.Id, false, "Invalid password");
                    return new AuthResult { Success = false, Message = "Invalid password" };
                }
            }
            catch (Exception ex)
            {
                await RecordLoginAttempt(null, false, $"Login failed: {ex.Message}");
                return new AuthResult
                {
                    Success = false,
                    Message = "An error occurred during login"
                };
            }
        }
        
        public async Task<bool> DeactivateUser(string email)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    return false;
                }

                // Enable lockout and set permanent lockout
                await _userManager.SetLockoutEnabledAsync(user, true);
                await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.MaxValue);

                // Sign out the user if they're currently authenticated
                var httpContext = _httpContextAccessor.HttpContext;
                if (httpContext?.User?.Identity?.IsAuthenticated == true &&
                    httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value == user.Id)
                {
                    await _signInManager.SignOutAsync();
                }

                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }

        public async Task<UserInfo> GetUserInfo()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext?.User == null || !httpContext.User.Identity.IsAuthenticated)
            {
                return null;
            }

            var userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return null;
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return null;
            }

            var userInfo = new UserInfo
            {
                Email = user.Email,
                UserName = user.UserName,
                Id = user.Id
            };

            return userInfo;
        }

        public async Task<UserInfo> ChangePassword(string currentPassword, string newPassword)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext?.User == null || !httpContext.User.Identity.IsAuthenticated)
            {
                return null;
            }

            var userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return null;
            }

            var user = await _userManager.FindByIdAsync(userId);

            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);

            if (result.Succeeded)
            {
                return new UserInfo
                {
                    Email = user.Email,
                    UserName = user.UserName,
                    Id = user.Id
                }; ;
            }
            return null;
        }

        public async Task<bool> ForgotPassword(string email, string newPassword)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return false;
            }
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            //var resetLink = $"{_configuration["App:ClientUrl"]}/reset-password?token={token}&email={email}";
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
            // Send email with reset link (implementation not shown here)
            // await _emailService.SendPasswordResetEmail(email, resetLink);
            return result.Succeeded
;
        }

        public async Task<string> Register(string email, string password)
        {
            try
            {
                var createUser = new IdentityUser { UserName = email, Email = email };
                var result = await _userManager.CreateAsync(createUser, password);

                if (result.Succeeded)
                {
                    var user = await _userManager.FindByEmailAsync(email);
                    if (user != null)
                    {
                        return user.Id;
                    }
                } else
                {
                    throw new Exception(result.Errors.First().Description);
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new Exception("User registration failed.", ex);
            }
        }

        public async Task<UserInfo> GetUserByEmail(string userId)
        {
            var user = await _userManager.FindByEmailAsync(userId);
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, "123456");
            if (user == null)
            {
                return null;
            }

            var userInfo = new UserInfo
            {
                Email = user.Email,
                UserName = user.UserName,
                Id = user.Id
            };

            return userInfo;
        }

        public class UserInfo
        {
            public string? Email { get; set; }
            public string? UserName { get; set; }
            public string? Id { get; set; }
        }

        private string GenerateJwtToken(IdentityUser user)
        {
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
            var tokenHandler = new JwtSecurityTokenHandler();
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Email ?? ""),
                    new Claim(ClaimTypes.NameIdentifier, user.Id ?? ""),
                    // Add more claims as needed, such as roles
                }),
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToInt32(_configuration["Jwt:ExpiryMinutes"])),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), 
                    SecurityAlgorithms.HmacSha256Signature)
            };
            
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        
        private async Task RecordLoginAttempt(string userId, bool success, string details)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var userAgent = httpContext?.Request.Headers["User-Agent"].ToString() ?? "Unknown";

            var loginAttempt = new UserLoginHistory
            {
                user_id = userId,
                created_at = DateTime.UtcNow,
                updated_at = DateTime.UtcNow,
                success = success,
                ip_address = httpContext?.Connection.RemoteIpAddress?.ToString() ?? "Unknown",
                device = ParseDevice(userAgent),
                browser = ParseBrowser(userAgent),
                os = ParseOperatingSystem(userAgent),
                start_time = DateTime.UtcNow,
                end_time = null
            };
            
            await _userLoginHistoryRepository.Add(loginAttempt);
        }
        
        private string ParseDevice(string userAgent)
        {
            if (string.IsNullOrEmpty(userAgent)) return "Unknown";
            
            if (userAgent.Contains("Mobile")) return "Mobile";
            if (userAgent.Contains("Tablet")) return "Tablet";
            return "Desktop";
        }

        private string ParseBrowser(string userAgent)
        {
            if (string.IsNullOrEmpty(userAgent)) return "Unknown";

            if (userAgent.Contains("Chrome")) return "Chrome";
            if (userAgent.Contains("Firefox")) return "Firefox";
            if (userAgent.Contains("Safari")) return "Safari";
            if (userAgent.Contains("Edge")) return "Edge";
            return "Unknown";
        }

        private string ParseOperatingSystem(string userAgent)
        {
            if (string.IsNullOrEmpty(userAgent)) return "Unknown";

            if (userAgent.Contains("Windows")) return "Windows";
            if (userAgent.Contains("Mac OS")) return "MacOS";
            if (userAgent.Contains("Android")) return "Android";
            if (userAgent.Contains("iOS")) return "iOS";
            if (userAgent.Contains("Linux")) return "Linux";
            return "Unknown";
        }
    }
    
    public class NoComplexityPasswordValidator : PasswordValidator<IdentityUser>
    {
        public override async Task<IdentityResult> ValidateAsync(UserManager<IdentityUser> manager, IdentityUser user,   
            string password)
        {
            return IdentityResult.Success;
        }
    }
}