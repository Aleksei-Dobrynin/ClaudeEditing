using Application.Models;
using Application.Repositories;
using Domain.Entities;
using Newtonsoft.Json;
using System.Text;
using Application.Services;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using Microsoft.Extensions.Configuration;

namespace Application.UseCases
{
    public class ApplicationPaidInvoiceUseCases
    {
        private readonly ILogger<N8nService> _logger;
        private readonly IUnitOfWork unitOfWork;
        private readonly IN8nService _n8nService;
        private ApplicationUseCases _applicationUseCases;
        private readonly IConfiguration _configuration;

        public ApplicationPaidInvoiceUseCases(IUnitOfWork unitOfWork, IN8nService n8nService, ILogger<N8nService> logger, IConfiguration configuration, ApplicationUseCases applicationUseCases)
        {
            _logger = logger;
            this.unitOfWork = unitOfWork;
            _n8nService = n8nService;
            _applicationUseCases = applicationUseCases;
            _configuration = configuration;
        }

        public Task<List<ApplicationPaidInvoice>> GetAll()
        {
            return unitOfWork.ApplicationPaidInvoiceRepository.GetAll();
        }

        public Task<List<ApplicationPaidInvoice>> GetOneByIDApplication(int idApplication)
        {
            return unitOfWork.ApplicationPaidInvoiceRepository.GetByIDApplication(idApplication);
        }

        public Task<List<ApplicationPaidInvoice>> GetApplicationWithTaxAndDateRange(DateTime startDate, DateTime endDate)
        {
            return unitOfWork.ApplicationPaidInvoiceRepository.GetApplicationWithTaxAndDateRange(startDate, endDate);
        }
        
        public Task<List<ApplicationPaidInvoice>> GetByApplicationGuid(string guid)
        {
            return unitOfWork.ApplicationPaidInvoiceRepository.GetByApplicationGuid(guid);
        }

        public Task<ApplicationPaidInvoice> GetOne(int id)
        {
            return unitOfWork.ApplicationPaidInvoiceRepository.GetOneByID(id);
        }
        public async Task<ApplicationPaidInvoice> Create(ApplicationPaidInvoice domain)
        {
            if (domain.mbank != true)
            {
                var user_id = await unitOfWork.UserRepository.GetUserID();
                domain.created_by = user_id;
                domain.created_at = DateTime.Now;
            }


            if (!string.IsNullOrWhiteSpace(domain.number))
            {
                var app = await unitOfWork.ApplicationRepository.GetOneByNumber(domain.number.Substring(3));
                domain.application_id = app.id;
            }


            var result = await unitOfWork.ApplicationPaidInvoiceRepository.Add(domain);
            domain.id = result;
            unitOfWork.Commit();


            var all = await unitOfWork.ApplicationPaidInvoiceRepository.GetByIDApplication(domain.application_id);
            var totalPaid = Math.Round(all.Sum(x => x.sum), 2);
            await unitOfWork.ApplicationRepository.UpdatePaidWithSum(domain.application_id, totalPaid);
            unitOfWork.Commit();

            if (domain.mbank == true)
            {
                var app = await unitOfWork.ApplicationRepository.GetOneByID(domain.application_id);
                try
                {
                    await _n8nService.RegisterInFinBook(app, true);
                    await _n8nService.RegisterInFinBookMBank(app, domain.payment_identifier, domain.sum);
                }
                catch (Exception e)
                {
                    _logger.LogError(e, "Error registering application {ApplicationNumber} in FinBookMBank", app.number);
                }
            }

            await _applicationUseCases.InvalidatePaginationCache();

            var applicaiton = await unitOfWork.ApplicationRepository.GetOneByID(domain.application_id);
            if(applicaiton.total_sum <= totalPaid)
            {
                var hostName = _configuration["RabbitMQ:Host"];
                var queueName = _configuration["RabbitMQ:ChangeAppStatusQueueName"];

                var message = new ChangeStatusQueue
                {
                    status = "documents_ready",
                    uuid = applicaiton.app_cabinet_uuid,
                };
                string jsonMessage = System.Text.Json.JsonSerializer.Serialize(message);


                var factory = new ConnectionFactory()
                {
                    HostName = hostName,
                    Password = _configuration["RabbitMQ:Username"],
                    UserName = _configuration["RabbitMQ:Password"]
                };
                using var connection = factory.CreateConnection();
                using var channel = connection.CreateModel();

                channel.QueueDeclare(queue: queueName, durable: true, exclusive: false, autoDelete: false, arguments: null);

                var body = Encoding.UTF8.GetBytes(jsonMessage);
                var properties = channel.CreateBasicProperties();
                properties.Persistent = true;

                channel.BasicPublish(exchange: "", routingKey: queueName, basicProperties: properties, body: body);

                // payed all sum
            }

            return domain;
        }
        public class ChangeStatusQueue
        {
            public string uuid { get; set; }
            public string status { get; set; }
        }

        public async Task<ApplicationPaidInvoice> Update(ApplicationPaidInvoice domain)
        {
            var user_id = await unitOfWork.UserRepository.GetUserID();
            domain.updated_by = user_id;
            domain.updated_at = DateTime.Now;

            await unitOfWork.ApplicationPaidInvoiceRepository.Update(domain);
            unitOfWork.Commit();

            var all = await unitOfWork.ApplicationPaidInvoiceRepository.GetByIDApplication(domain.application_id);
            var totalPaid = Math.Round(all.Sum(x => x.sum), 2);
            await unitOfWork.ApplicationRepository.UpdatePaidWithSum(domain.application_id, totalPaid);
            unitOfWork.Commit();

            await _applicationUseCases.InvalidatePaginationCache();

            return domain;
        }

        public Task<PaginatedList<ApplicationPaidInvoice>> GetPagniated(int pageSize, int pageNumber)
        {
            if (pageSize < 1) pageSize = 1;
            if (pageNumber < 1) pageNumber = 1;
            return unitOfWork.ApplicationPaidInvoiceRepository.GetPaginated(pageSize, pageNumber);
        }

        public async Task<int> Delete(int id)
        {

            var item = await unitOfWork.ApplicationPaidInvoiceRepository.GetOneByID(id);
            var application_id = item.application_id;
            var all = await unitOfWork.ApplicationPaidInvoiceRepository.GetByIDApplication(application_id);

            await unitOfWork.ApplicationPaidInvoiceRepository.Delete(id);
            unitOfWork.Commit();

            var totalPaid = Math.Round(all.Sum(x => x.sum), 2);
            await unitOfWork.ApplicationRepository.UpdatePaidWithSum(application_id, totalPaid);
            unitOfWork.Commit();

            await _applicationUseCases.InvalidatePaginationCache();

            return id;
        }

        public async Task<List<PaidInvoiceInfo>> GetPaidInvoices(DateTime dateStart, DateTime dateEnd, string? number, int[]? structures_ids)
        {
            return await unitOfWork.ApplicationPaidInvoiceRepository.GetPaidInvoices(dateStart, dateEnd, number, structures_ids);
        }
    }
}
