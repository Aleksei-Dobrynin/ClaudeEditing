using Application.Services;
using Domain.Entities;

namespace Application.Tests.Mocks
{
    public class MockSendNotification : ISendNotification
    {
        private readonly bool _alwaysSucceed;
        private readonly List<string> _calls = new List<string>();
        
        public MockSendNotification(bool alwaysSucceed = true)
        {
            _alwaysSucceed = alwaysSucceed;
        }

        public Task SendNotification(string notification_code, int employee_id, Dictionary<string, string> parameters)
        {
            _calls.Add($"SendNotification:{notification_code}:{employee_id}");
            return Task.FromResult(_alwaysSucceed);
        }

        public Task SendFeedback(string date, string employee_name, string description, int count_files)
        {
            _calls.Add($"SendFeedback:{date}:{employee_name}:{description}:{count_files}");
            return Task.FromResult(_alwaysSucceed);
        }

        public Task<bool> SendRawNotification(List<SendNotificationService.SendMessageN8n> messages)
        {
            _calls.Add($"SendRawNotification:MessagesCount:{messages?.Count ?? 0}");
            return Task.FromResult(_alwaysSucceed);
        }

        public async Task JustSendNn8nNotifications(List<SendNotificationService.SendMessageN8n> data)
        {
            _calls.Add($"JustSendNn8nNotifications:MessagesCount:{data?.Count ?? 0}");
        }
    }
}