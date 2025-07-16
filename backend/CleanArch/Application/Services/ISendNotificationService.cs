using Application.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using static Application.Services.SendNotificationService;

namespace Application.Services
{
    public interface ISendNotification
    {
        Task SendNotification(string notification_code, int employee_id, Dictionary<string, string> parameters);
        Task SendFeedback(string date, string employee_name, string description, int count_files);
        Task JustSendNn8nNotifications(List<SendMessageN8n> data);
        Task<bool> SendRawNotification(List<SendMessageN8n> messages);
    }
}
