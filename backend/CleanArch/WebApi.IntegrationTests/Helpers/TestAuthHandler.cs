using System.Security.Claims;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace WebApi.IntegrationTests.Helpers
{
    public class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public TestAuthHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock) 
            : base(options, logger, encoder, clock)
        {
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            // Создаем утверждения для тестового пользователя
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, "test.user@example.com"),
                new Claim(ClaimTypes.NameIdentifier, "1"),
                new Claim(ClaimTypes.Email, "test.user@example.com"),
                new Claim("uid", "test-user-id"),
                // Добавьте любые другие утверждения, которые нужны вашему приложению
                // Например, роли:
                new Claim(ClaimTypes.Role, "Admin")
            };

            // Создаем ClaimsIdentity и ClaimsPrincipal
            var identity = new ClaimsIdentity(claims, "TestScheme");
            var principal = new ClaimsPrincipal(identity);
            
            // Создаем билет аутентификации
            var ticket = new AuthenticationTicket(principal, "TestScheme");
            
            // Возвращаем успешный результат аутентификации
            return Task.FromResult(AuthenticateResult.Success(ticket));
        }
    }
}