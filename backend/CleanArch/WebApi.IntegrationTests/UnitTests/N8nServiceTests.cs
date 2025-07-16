using System.Net;
using Application.Repositories;
using Application.Services;
using Application.Tests.Mocks;
using Application.UseCases;
using Domain.Entities;
using Messaging.Services;
using Moq;
using StackExchange.Redis;

namespace WebApi.UnitTests.Tests
{
    public class N8nServiceTests
    {
        [Fact]
        public async Task ApplicationUseCases_WhenSuccessfulStatusChange_ShouldCallExecuteWorkflow()
        {
            // Arrange
            var mockN8nService = new MockN8nService();
            var mockUnitOfWork = new Mock<IUnitOfWork>();
            var mockEmployeeRepository = new Mock<IEmployeeRepository>();
            var mockEmployeeInStructureRepository = new Mock<IEmployeeInStructureRepository>();
            var mockApplicationTaskAssigneeRepository = new Mock<Iapplication_task_assigneeRepository>();
            var mockApplicationRoadRepository = new Mock<IApplicationRoadRepository>();
            var mockSendNotification = new Mock<ISendNotification>();
            var mockUserRepository = new Mock<IUserRepository>();
            var mockRabbit = new Mock<IRabbitMQPublisher>();
            var mockBgaService = new Mock<IBgaService>();
            var mockIn8nRepository = new Mock<In8nRepository>();


            // Setup necessary mocks
            mockBgaService.Setup(x => x.SendCabinetFilesAsync(It.IsAny<CabinetMessage>())).Returns(Task.CompletedTask);
            mockBgaService.Setup(x => x.SendApproveRequestAsync(It.IsAny<string>(), It.IsAny<string>())).Returns(Task.CompletedTask);
            //mockBgaService.Setup(x => x.SendRejectRequestAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int[]>())).Returns(Task.CompletedTask);

            mockRabbit.Setup(x => x.PublishMessageAsync(It.IsAny<SendNotificationService.SendMessageN8n>())).Returns(Task.CompletedTask);
            mockUnitOfWork.Setup(u => u.UserRepository).Returns(mockUserRepository.Object);
            mockUserRepository.Setup(u => u.GetUserID()).ReturnsAsync(1);
            var applicationStatus = new ApplicationStatus { id = 1, code = "some_status" };
            mockUnitOfWork.Setup(u => u.ApplicationStatusRepository.GetById(It.IsAny<int>()))
                .ReturnsAsync(applicationStatus);

            var application = new Domain.Entities.Application { id = 123, status_id = 1 };
            mockUnitOfWork.Setup(u => u.ApplicationRepository.GetOneByID(It.IsAny<int>()))
                .ReturnsAsync(application);

            var applicationRoad = new ApplicationRoad
            {
                from_status_id = 1,
                to_status_id = 2,
                post_function_url = "/webhook/some-workflow"
            };
            mockApplicationRoadRepository.Setup(r => r.GetByStatuses(It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync(applicationRoad);

            mockUnitOfWork.Setup(u => u.ApplicationRepository.ChangeStatus(It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync(1);

            mockUnitOfWork.Setup(u => u.ApplicationStatusHistoryRepository.Add(It.IsAny<ApplicationStatusHistory>()))
                .ReturnsAsync(1);
            
            var mockRedisDb = new Mock<IDatabase>();
            var mockRedis = new Mock<IConnectionMultiplexer>();
            
            mockRedisDb.SetupGet(x => x.Multiplexer).Returns(mockRedis.Object);
            
            mockRedis.Setup(x => x.GetDatabase(It.IsAny<int>(), It.IsAny<object>())).Returns(mockRedisDb.Object);
            
            var mockServer = new Mock<IServer>();
            mockServer.Setup(x => x.Keys(It.IsAny<int>(), It.IsAny<RedisValue>(), It.IsAny<int>(), It.IsAny<long>(), It.IsAny<int>(), It.IsAny<CommandFlags>()))
                .Returns(Array.Empty<RedisKey>().AsEnumerable());

            mockRedis.Setup(x => x.GetEndPoints(It.IsAny<bool>())).Returns(new[] { new DnsEndPoint("localhost", 6379) });
            mockRedis.Setup(x => x.GetServer(It.IsAny<EndPoint>(), It.IsAny<object>())).Returns(mockServer.Object);

            var mockMariaDbRepository = new Mock<IMariaDbRepository>();
            mockMariaDbRepository.Setup(r => r.HasMariaDbConnection()).Returns(false); // или true, если нужно
            
            mockUnitOfWork.Setup(u => u.MariaDbRepository)
                .Returns(mockMariaDbRepository.Object);

            // Create the ApplicationUseCases with our mocked dependencies
            var applicationUseCases = new ApplicationUseCases(
                mockUnitOfWork.Object,
                mockEmployeeRepository.Object,
                mockEmployeeInStructureRepository.Object,
                mockApplicationTaskAssigneeRepository.Object,
                mockApplicationRoadRepository.Object,
                mockSendNotification.Object,
                null,
                mockN8nService,
                mockRabbit.Object,
                mockBgaService.Object, 
                null, 
                mockIn8nRepository.Object, 
                mockRedis.Object
            );

            //// Act
            //await applicationUseCases.ChangeStatus(123, 2);

            // Assert
            var calls = mockN8nService.GetCalls();
            Assert.Contains(calls, call => call.StartsWith("ExecuteWorkflow:123:/webhook/some-workflow"));
        }
    }
}