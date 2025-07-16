using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class LoginDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
    
    public class ChangePasswordDto
    {
        public string Username { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
    
    public class ForgotPasswordDto
    {
        public string Email { get; set; }
    }
}
