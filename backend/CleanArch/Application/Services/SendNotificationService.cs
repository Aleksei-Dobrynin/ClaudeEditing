using Application.Repositories;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using DocumentFormat.OpenXml.Drawing.Charts;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Application.Services
{
    public class SendNotificationService : ISendNotification
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IConfiguration _configuration;

        public SendNotificationService(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            this.unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        public async Task<bool> SendRawNotification(List<SendMessageN8n> messages)
        {
            try
            {
                using var client = new HttpClient();
                var request = new HttpRequestMessage(HttpMethod.Post, _configuration["N8N:NotificationURL"]);
                var json = JsonSerializer.Serialize(messages);

                var content = new StringContent(json, Encoding.UTF8, "application/json");
                request.Content = content;
                var response = await client.SendAsync(request);
                response.EnsureSuccessStatusCode();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
      
        }
        public async Task SendNotification(string notification_code, int employee_id, Dictionary<string, string> parameters)
        {
            try
            {

                var notifies = await unitOfWork.notification_templateRepository.GetByCode(notification_code);
                var emp_contacts = await unitOfWork.employee_contactRepository.GetContactsByEmployeeId(employee_id);
                var userId = await unitOfWork.EmployeeRepository.GetUserIdByEmployeeID(employee_id);
                var sendMessages = new List<SendMessageN8n>();
                var notifications = new List<notification>();

                notifies.ForEach(notify =>
                {
                    var notify_allowed = emp_contacts.Where(x => x.type_id == notify.contact_type_id && x.allow_notification == true).ToList();
                    var message = notify.body;
                    var subject = notify.subject;
                    var link = notify.link;
                    foreach (var item in parameters)
                    {
                        message = message.Replace("{" + item.Key + "}", item.Value);
                        subject = subject.Replace("{" + item.Key + "}", item.Value);
                        link = link.Replace("{" + item.Key + "}", item.Value);
                    }
                    notify_allowed.ForEach(contact =>
                    {
                        var sendMessage = new SendMessageN8n
                        {
                            value = contact.value,
                            message = message,
                            subject = subject,
                            employee_id = employee_id,
                            user_id = userId
                        };
                        if (contact.type_code == "telegram")
                        {
                            sendMessage.type_con = "telegram";
                            sendMessages.Add(sendMessage);
                        }
                        else if (contact.type_code == "email")
                        {
                            sendMessage.type_con = "email";
                            sendMessages.Add(sendMessage);
                        }
                        else if (contact.type_code == "sms")
                        {
                            sendMessage.type_con = "sms";
                            sendMessages.Add(sendMessage);
                        }
                        else
                        {
                            // not alllowed other types
                        }
                    });
                    if (notify.contact_type_id == null && userId != null)
                    {
                        var notificationBase = new notification
                        {
                            user_id = userId,
                            employee_id = employee_id,
                            has_read = false,
                            created_at = DateTime.Now,
                            title = subject,
                            text = message,
                            link = link,
                        };
                        notifications.Add(notificationBase);
                    }
                });
                foreach (var noti in notifications)
                {
                    await unitOfWork.notificationRepository.Add(noti);
                }

                unitOfWork.Commit();
                using var client = new HttpClient();
                var request = new HttpRequestMessage(HttpMethod.Post,
                    "https://n8n.tech-demo.su/webhook/855c5f94-2299-45bf-901d-00f943c52e2c"); // prod

                //request = new HttpRequestMessage(HttpMethod.Post,
                //    "https://n8n.tech-demo.su/webhook-test/855c5f94-2299-45bf-901d-00f943c52e2c");

                var json = JsonSerializer.Serialize(sendMessages);

                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
                request.Content = content;
                var response = await client.SendAsync(request);
                response.EnsureSuccessStatusCode();
            }

            catch (Exception ex)
            {
                //TODO log
            }
        }

        public async Task SendFeedback(string date, string employee_name, string description, int count_files)
        {
            using var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Post, _configuration["N8N:FeedbackURL"]);
            var json = JsonSerializer.Serialize(new
            {
                date,
                employee_name,
                description,
                count_files
            });

            var content = new StringContent(json, Encoding.UTF8, "application/json");
            request.Content = content;
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();
        }


        public async Task JustSendNn8nNotifications(List<SendMessageN8n> data)
        {
            using var client = new HttpClient();
            var request = new HttpRequestMessage(HttpMethod.Post,
                "https://n8n.tech-demo.su/webhook/855c5f94-2299-45bf-901d-00f943c52e2c"); // prod

            //request = new HttpRequestMessage(HttpMethod.Post,
            //    "https://n8n.tech-demo.su/webhook-test/855c5f94-2299-45bf-901d-00f943c52e2c");

            var json = JsonSerializer.Serialize(data);

            var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
            request.Content = content;
            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();

        }

        public class SendMessageN8n
        {
            public string type_con { get; set; }
            public string message { get; set; }
            public string subject { get; set; }
            public string value { get; set; }
            public int employee_id { get; set; }
            public int? user_id { get; set; }
            public int? application_id { get; set; }
            public string? application_uuid { get; set; }
            public int? customer_id { get; set; }
        }
    }
}
