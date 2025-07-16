using Application.Repositories;
using Application.UseCases;
using Application.Services;
using AuthLibrary;
using Domain.Entities;
using Infrastructure.Data;
using Infrastructure.Repositories;
using Infrastructure.Tunduk;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Sinks.Telegram;
using System.Data;
using System.Security.Claims;
using System.Text;
using Messaging.Services;
using Messaging.Shared;
using Messaging.Shared.Events;
using Messaging.Shared.RabbitMQ;
using Services.Microservice.EventHandlers;
using StackExchange.Redis;
using WebApi.Middleware;
using IUnitOfWork = Application.Repositories.IUnitOfWork;
using Infrastructure.Services;

namespace WebApi
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var botToken = builder.Configuration["Logging:Token"];
            var chatId = builder.Configuration["Logging:Channel"];

            Log.Logger = new LoggerConfiguration()
                .WriteTo.Telegram(token: botToken, chatId: chatId, restrictedToMinimumLevel: Serilog.Events.LogEventLevel.Warning)
                .CreateLogger();

            Log.Warning("Starting web host");

            // Add services to the container.
            builder.Host.UseSerilog();

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

            builder.Services.AddCors();

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            
            builder.Services.AddLogging();

            builder.Services.AddScoped<DapperDbContext>();
            builder.Services.AddScoped<IDbConnection>(provider =>
                provider.GetService<DapperDbContext>()!.CreateConnection());
            builder.Services.AddScoped<MariaDbContext>();
            //builder.Services.AddScoped<IDbConnection>(provider =>
            //    provider.GetService<MariaDbContext>()!.CreateConnection());

            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddHttpClient();
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
                        ClockSkew = TimeSpan.Zero
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = context =>
                        {
                            if (context.Exception is SecurityTokenExpiredException)
                            {
                                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                                context.Response.ContentType = "application/json";
                                return context.Response.WriteAsync(new
                                {
                                    message = "Token has expired"
                                }.ToString());
                            }

                            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                            context.Response.ContentType = "application/json";
                            return context.Response.WriteAsync(new
                            {
                                message = "Authentication failed"
                            }.ToString());
                        },

                        OnTokenValidated = async context =>
                        {
                            var userService = context.HttpContext.RequestServices.GetRequiredService<AuthService>();
                            var userRepository = context.HttpContext.RequestServices.GetRequiredService<IUserRepository>();
            
                            // Get user ID from claims
                            var userIdClaim = context.Principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
                            if (!string.IsNullOrEmpty(userIdClaim))
                            {
                                // Update last login time for the user
                                var user = await userRepository.GetByEmail(context.Principal.Identity.Name);
                                if (user != null)
                                {
                                    await userRepository.UpdateLastLogin(user.id);
                                }
                            }
                        }
                    };
                });
            builder.Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(builder.Configuration.GetConnectionString("RedisConnection")));
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddScoped<AuthService>();
            builder.Services.AddScoped<IPdfGenerator, PdfGenerator>();

            builder.Services.Configure<FormOptions>(options =>
            {
                options.MultipartBodyLengthLimit = int.MaxValue;
            });
            builder.WebHost.UseKestrel(options =>
            {
                options.Limits.MaxRequestBodySize = int.MaxValue;
            });
            builder.Services.Configure<KestrelServerOptions>(options =>
            {
                options.Limits.MaxRequestBodySize = int.MaxValue;
            });
            
            // Configure RabbitMQ
            builder.Services.Configure<RabbitMQOptions>(builder.Configuration.GetSection("RabbitMQ"));
            builder.Services.AddSingleton<IRabbitMQConnection, RabbitMQConnection>();

            // Configure EventBus
            builder.Services.AddSingleton<IEventBus>(sp =>
            {
                var rabbitMQConnection = sp.GetRequiredService<IRabbitMQConnection>();
                var logger = sp.GetRequiredService<ILogger<RabbitMQEventBus>>();
                var serviceName = "services";
                var queueName = $"bga_{serviceName}_queue"; // Stable queue name for the service type

                return new RabbitMQEventBus(
                    rabbitMQConnection,
                    logger,
                    sp,
                    queueName);
            });
            
            //// Register event handlers
            builder.Services.AddTransient<ServiceRequestedEventHandler>();
            builder.Services.AddSingleton<IRabbitMQPublisher, RabbitMQPublisher>();
            builder.Services.AddHostedService<BgaService>();
            builder.Services.AddScoped<IBgaService, BgaService>();
            builder.Services.AddHostedService<NotificationsSendCabinet>();
            builder.Services.AddHostedService<SignDocsFromCabinet>();
            builder.Services.AddHostedService<ResendService>();
            builder.Services.AddHostedService<SynchronizeCustomerApplications>();

            builder.Services.AddScoped<ISmProjectRepository, SmProjectRepository>();
            builder.Services.AddScoped<IWorkScheduleRepository, WorkScheduleRepository>();
            builder.Services.AddScoped<ISmProjectTypeRepository, SmProjectTypeRepository>();
            builder.Services.AddScoped<ISmProjectTagsRepository, SmProjectTagsRepository>();
            builder.Services.AddScoped<ICustomSvgIconRepository, CustomSvgIconRepository>();
            builder.Services.AddScoped<ISurveyTagsRepository, SurveyTagsRepository>();
            builder.Services.AddScoped<IWorkScheduleRepository, WorkScheduleRepository>();
            builder.Services.AddScoped<IWorkScheduleExceptionRepository, WorkScheduleExceptionRepository>();
            builder.Services.AddScoped<IWorkDayRepository, WorkDayRepository>();
            builder.Services.AddScoped<IOrgStructureRepository, OrgStructureRepository>();
            builder.Services.AddScoped<IApplicationDocumentTypeRepository, ApplicationDocumentTypeRepository>();
            builder.Services.AddScoped<IApplicationDocumentRepository, ApplicationDocumentRepository>();
            builder.Services
                .AddScoped<IFileTypeForApplicationDocumentRepository, FileTypeForApplicationDocumentRepository>();
            builder.Services.AddScoped<IServiceDocumentRepository, ServiceDocumentRepository>();
            builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
            builder.Services.AddScoped<IEmployeeInStructureRepository, EmployeeInStructureRepository>();
            builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
            builder.Services.AddScoped<IAuthRepository, AuthRepository>();
            builder.Services.AddScoped<WorkScheduleUseCases>();
            builder.Services
                .AddScoped<IS_DocumentTemplateTranslationRepository, S_DocumentTemplateTranslationRepository>();
            builder.Services.AddScoped<IS_DocumentTemplateRepository, S_DocumentTemplateRepository>();
            builder.Services
                .AddScoped<IS_TemplateDocumentPlaceholderRepository, S_TemplateDocumentPlaceholderRepository>();
            builder.Services.AddScoped<IS_DocumentTemplateTypeRepository, S_DocumentTemplateTypeRepository>();
            builder.Services.AddScoped<ICustomSvgIconRepository, CustomSvgIconRepository>();
            builder.Services.AddScoped<IS_PlaceHolderTemplateRepository, S_PlaceHolderTemplateRepository>();
            builder.Services.AddScoped<ILanguageRepository, LanguageRepository>();
            builder.Services.AddScoped<IS_QueriesDocumentTemplateRepository, S_QueriesDocumentTemplateRepository>();
            builder.Services.AddScoped<IS_PlaceHolderTypeRepository, S_PlaceHolderTypeRepository>();
            builder.Services.AddScoped<IS_QueryRepository, S_QueryRepository>();
            builder.Services.AddScoped<IApplicationRepository, ApplicationRepository>();
            builder.Services.AddScoped<IMariaDbRepository, MariaDbRepository>();
            builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
            builder.Services.AddScoped<IDistrictRepository, DistrictRepository>();
            builder.Services.AddScoped<IArchObjectRepository, ArchObjectRepository>();
            builder.Services
                .AddScoped<Iuploaded_application_documentRepository, uploaded_application_documentRepository>();
            builder.Services.AddScoped<ICustomerRepresentativeRepository, CustomerRepresentativeRepository>();
            builder.Services.AddScoped<IWorkflowRepository, WorkflowRepository>();
            builder.Services.AddScoped<IWorkflowTaskTemplateRepository, WorkflowTaskTemplateRepository>();
            builder.Services.AddScoped<IWorkflowTaskDependencyRepository, WorkflowTaskDependencyRepository>();
            builder.Services.AddScoped<IWorkflowSubtaskTemplateRepository, WorkflowSubtaskTemplateRepository>();

            builder.Services.AddScoped<Iapplication_paymentRepository, application_paymentRepository>();
            builder.Services.AddScoped<Itask_statusRepository, task_statusRepository>();
            builder.Services.AddScoped<Iapplication_subtaskRepository, application_subtaskRepository>();
            builder.Services.AddScoped<Iapplication_task_assigneeRepository, application_task_assigneeRepository>();
            builder.Services.AddScoped<Iapplication_taskRepository, application_taskRepository>();
            builder.Services.AddScoped<Icontact_typeRepository, contact_typeRepository>();
            builder.Services.AddScoped<Icustomer_contactRepository, customer_contactRepository>();
            builder.Services.AddScoped<Iorganization_typeRepository, organization_typeRepository>();
            builder.Services.AddScoped<InotificationRepository, notificationRepository>();
            builder.Services.AddScoped<IMinjustRepository, MinjustRepository>();
            builder.Services.AddScoped<Iemployee_contactRepository, employee_contactRepository>();
            builder.Services.AddScoped<Isaved_application_documentRepository, saved_application_documentRepository>();
            builder.Services.AddScoped<Iapplication_commentRepository, application_commentRepository>();
            builder.Services.AddScoped<Icontragent_interaction_docRepository, contragent_interaction_docRepository>();
            builder.Services.AddScoped<Icontragent_interactionRepository, contragent_interactionRepository>();
            builder.Services.AddScoped<IcontragentRepository, contragentRepository>();
            builder.Services
                .AddScoped<Iapplication_subtask_assigneeRepository, application_subtask_assigneeRepository>();
            builder.Services.AddScoped<Itask_typeRepository, task_typeRepository>();
            builder.Services.AddScoped<IApplicationWorkDocumentRepository, ApplicationWorkDocumentRepository>();
            builder.Services.AddScoped<IApplicationStatusRepository, ApplicationStatusRepository>();
            builder.Services.AddScoped<IEmployeeEventRepository, EmployeeEventRepository>();
            builder.Services.AddScoped<IHrmsEventTypeRepository, HrmsEventTypeRepository>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<Ifaq_questionRepository, faq_questionRepository>();
            builder.Services.AddScoped<Iorg_structure_templatesRepository, org_structure_templatesRepository>();
            builder.Services.AddScoped<IApplicationRoadRepository, ApplicationRoadRepository>();
            builder.Services.AddScoped<In8nRepository, n8nRepository>();
            builder.Services.AddScoped<Inotification_templateRepository, notification_templateRepository>();

			builder.Services.AddScoped<IUserLoginHistoryRepository, UserLoginHistoryRepository>();

            builder.Services.AddScoped<ICustomSubscribtionRepository, CustomSubscribtionRepository>();

            builder.Services.AddScoped<Itelegram_subjectsRepository, telegram_subjectsRepository>();
            builder.Services.AddScoped<Itelegram_questionsRepository, telegram_questionsRepository>();
            builder.Services.AddScoped<Itelegram_questions_chatsRepository, telegram_questions_chatsRepository>();
            builder.Services.AddScoped<Iuser_selectable_questions_telegramRepository, user_selectable_questions_telegramRepository>();
            builder.Services.AddScoped<ISendNotification, SendNotificationService>();
            builder.Services.AddScoped<IN8nService, N8nService>();
            builder.Services.AddScoped<IMapRepository, MapRepository>();
            builder.Services.AddScoped<Inotification_logRepository, notification_logRepository>();
            builder.Services.AddScoped<IArchiveObjectRepository, ArchiveObjectRepository>();
            builder.Services.AddScoped<IArchiveObjectFileRepository, ArchiveObjectFileRepository>();
            builder.Services.AddScoped<IArchiveLogStatusRepository, ArchiveLogStatusRepository>();
            builder.Services.AddScoped<IArchiveLogRepository, ArchiveLogRepository>();
            builder.Services.AddScoped<Istructure_application_logRepository, structure_application_logRepository>();
            builder.Services.AddScoped<Iidentity_document_typeRepository, identity_document_typeRepository>();
            builder.Services.AddScoped<Iapplication_objectRepository, application_objectRepository>();
            builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
            builder.Services.AddScoped<IFeedbackFilesRepository, FeedbackFilesRepository>();
            builder.Services.AddScoped<IreestrRepository, reestrRepository>();
            builder.Services.AddScoped<Iapplication_in_reestrRepository, application_in_reestrRepository>();
            builder.Services.AddScoped<Ireestr_statusRepository, reestr_statusRepository>();
            builder.Services.AddScoped<ICustomerDiscountRepository, CustomerDiscountRepository>();
            builder.Services.AddScoped<ICustomerDiscountDocumentsRepository, CustomerDiscountDocumentsRepository>();
            builder.Services.AddScoped<IDiscountDocumentsRepository, DiscountDocumentsRepository>();
            builder.Services.AddScoped<IDiscountDocumentTypeRepository, DiscountDocumentTypeRepository>();
            builder.Services.AddScoped<IDiscountTypeRepository, DiscountTypeRepository>();
            builder.Services.AddScoped<Iobject_tagRepository, object_tagRepository>();
            builder.Services.AddScoped<Istructure_tag_applicationRepository, structure_tag_applicationRepository>();
            builder.Services.AddScoped<Istructure_tagRepository, structure_tagRepository>();
            builder.Services.AddScoped<IApplicationFilterRepository, ApplicationFilterRepository>();
            builder.Services.AddScoped<IApplicationFilterTypeRepository, ApplicationFilterTypeRepository>();
            builder.Services.AddScoped<IWorkDocumentTypeRepository, WorkDocumentTypeRepository>();
            builder.Services.AddScoped<ISystemSettingRepository, SystemSettingRepository>();
            builder.Services.AddScoped<Iapplication_squareRepository, application_squareRepository>();
            builder.Services.AddScoped<IQueryFiltersRepository, QueryFiltersRepository>();
            builder.Services.AddScoped<Iarchitecture_statusRepository, architecture_statusRepository>();
            builder.Services.AddScoped<Iarchive_file_tagsRepository, archive_file_tagsRepository>();
            builder.Services.AddScoped<Iarchitecture_processRepository, architecture_processRepository>();
            builder.Services.AddScoped<Istatus_dutyplan_objectRepository, status_dutyplan_objectRepository>();
            builder.Services.AddScoped<Iarchirecture_roadRepository, archirecture_roadRepository>();
            builder.Services.AddScoped<Iapplication_duty_objectRepository, application_duty_objectRepository>();
            builder.Services.AddScoped<Iarchive_doc_tagRepository, archive_doc_tagRepository>();
            builder.Services.AddScoped<Iarchive_folderRepository, archive_folderRepository>();
            builder.Services.AddScoped<ICountryRepository, CountryRepository>();
            builder.Services.AddScoped<IArchiveObjectCustomerRepository, ArchiveObjectCustomerRepository>();
            builder.Services.AddScoped<Icustomers_for_archive_objectRepository, customers_for_archive_objectRepository>();
            builder.Services.AddScoped<IStructureTemplatesRepository, StructureTemplatesRepository>(); 
            builder.Services.AddScoped<ITechCouncilRepository, TechCouncilRepository>();
            builder.Services.AddScoped<ITechCouncilParticipantsSettingsRepository, TechCouncilParticipantsSettingsRepository>();
            builder.Services.AddScoped<IDecisionTypeRepository, DecisionTypeRepository>();
            builder.Services.AddScoped<ITechCouncilFilesRepository, TechCouncilFilesRepository>();
            builder.Services.AddScoped<IApplicationLegalRecordRepository, ApplicationLegalRecordRepository>();
            builder.Services.AddScoped<ILegalRecordInCouncilRepository, LegalRecordInCouncilRepository>();
            builder.Services.AddScoped<Ilegal_act_objectRepository, legal_act_objectRepository>();
            builder.Services.AddScoped<Iapplication_legal_recordRepository, application_legal_recordRepository>();
            builder.Services.AddScoped<Ilegal_record_objectRepository, legal_record_objectRepository>();
            builder.Services.AddScoped<Ilegal_record_registryRepository, legal_record_registryRepository>();
            builder.Services.AddScoped<Ilegal_objectRepository, legal_objectRepository>();
            builder.Services.AddScoped<Ilegal_registry_statusRepository, legal_registry_statusRepository>();
            builder.Services.AddScoped<Ilegal_act_registryRepository, legal_act_registryRepository>();
            builder.Services.AddScoped<Ilegal_act_registry_statusRepository, legal_act_registry_statusRepository>();
            builder.Services.AddScoped<IDutyPlanLogRepository, DutyPlanLogRepository>();

            builder.Services.AddScoped<IreleaseRepository, releaseRepository>();
            builder.Services.AddScoped<Irelease_videoRepository, release_videoRepository>();
            builder.Services.AddScoped<Irelease_seenRepository, release_seenRepository>();
            builder.Services.AddScoped<ITechCouncilSessionRepository, TechCouncilSessionRepository>();
            builder.Services.AddScoped<ISecurityEventRepository, SecurityEventRepository>();
            builder.Services.AddScoped<ISecurityLoggingService, SecurityLoggingService>();
            builder.Services.AddScoped<IServicePriceRepository, ServicePriceRepository>();
            builder.Services.AddScoped<Iapplication_stepRepository, application_stepRepository>();
            builder.Services.AddScoped<Iapplication_pauseRepository, application_pauseRepository>();
            builder.Services.AddScoped<Iservice_pathRepository, service_pathRepository>();
            builder.Services.AddScoped<Ipath_stepRepository, path_stepRepository>();
            builder.Services.AddScoped<Istep_dependencyRepository, step_dependencyRepository>();
            builder.Services.AddScoped<Idocument_approverRepository, document_approverRepository>();
            builder.Services.AddScoped<Istep_required_documentRepository, step_required_documentRepository>();
            builder.Services.AddScoped<Istep_partnerRepository, step_partnerRepository>();
            builder.Services.AddScoped<Istep_required_work_documentRepository, step_required_work_documentRepository>();

            builder.Services.AddScoped<Idocument_approvalRepository, document_approvalRepository>();
            builder.Services.AddScoped<ILawDocumentTypeRepository, LawDocumentTypeRepository>();
            builder.Services.AddScoped<ILawDocumentRepository, LawDocumentRepository>();
            builder.Services.AddScoped<IApplicationRequiredCalcRepository, ApplicationRequiredCalcRepository>();
            builder.Services.AddScoped<IStepRequiredCalcRepository, StepRequiredCalcRepository>();

            builder.Services.AddScoped<IStepStatusLogRepository, StepStatusLogRepository>();
            builder.Services.AddScoped<IApplicationInReestrCalcRepository, ApplicationInReestrCalcRepository>();
            builder.Services.AddScoped<IApplicationInReestrPayedRepository, ApplicationInReestrPayedRepository>();
            builder.Services.AddScoped<IApplicationOutgoingDocumentRepository, ApplicationOutgoingDocumentRepository>();
            builder.Services.AddScoped<IDocumentJournalsRepository, DocumentJournalsRepository>();
            builder.Services.AddScoped<IServiceStatusNumberingRepository, ServiceStatusNumberingRepository>();
            builder.Services.AddScoped<IJournalPlaceholderRepository, JournalPlaceholderRepository>();
            builder.Services.AddScoped<IJournalTemplateTypeRepository, JournalTemplateTypeRepository>();
            builder.Services.AddScoped<IJournalApplicationRepository, JournalApplicationRepository>();



            builder.Services.AddScoped<employee_contactUseCases>();
            builder.Services.AddScoped<notification_log_statusUseCases>();
            builder.Services.AddScoped<S_DocumentTemplateTranslationUseCases>();
            builder.Services.AddScoped<S_DocumentTemplateUseCases>();
            builder.Services.AddScoped<S_TemplateDocumentPlaceholderUseCases>();
            builder.Services.AddScoped<S_DocumentTemplateTypeUseCases>();
            builder.Services.AddScoped<CustomSvgIconUseCases>();
            builder.Services.AddScoped<S_PlaceHolderTemplateUseCases>();
            builder.Services.AddScoped<LanguageUseCases>();
            builder.Services.AddScoped<S_QueriesDocumentTemplateUseCases>();
            builder.Services.AddScoped<S_PlaceHolderTypeUseCases>();
            builder.Services.AddScoped<S_QueryUseCases>();
            builder.Services.AddScoped<SmProjectUseCases>();
            builder.Services.AddScoped<SmProjectTypeUseCases>();
            builder.Services.AddScoped<SmProjectTagsUseCases>();
            builder.Services.AddScoped<SurveyTagsUseCases>();
            builder.Services.AddScoped<CustomSvgIconUseCases>();
            builder.Services.AddScoped<WorkScheduleUseCases>();
            builder.Services.AddScoped<WorkScheduleExceptionUseCases>();
            builder.Services.AddScoped<WorkDayUseCases>();
            builder.Services.AddScoped<OrgStructureUseCases>();
            builder.Services.AddScoped<ApplicationDocumentTypeUseCases>();
            builder.Services.AddScoped<ApplicationDocumentUseCases>();
            builder.Services.AddScoped<FileTypeForApplicationDocumentUseCases>();
            builder.Services.AddScoped<FileForApplicationDocumentUseCases>();
            builder.Services.AddScoped<FileUseCases>();
            builder.Services.AddScoped<ServiceDocumentUseCases>();
            builder.Services.AddScoped<ServiceUseCases>();
            builder.Services.AddScoped<EmployeeInStructureUseCases>();
            builder.Services.AddScoped<EmployeeUseCases>();
            builder.Services.AddScoped<AuthUseCases>();
            builder.Services.AddScoped<RoleUseCases>();
            builder.Services.AddScoped<UserRoleUseCases>();
            builder.Services.AddScoped<StructurePostUseCases>();
            builder.Services.AddScoped<ApplicationUseCases>();
            builder.Services.AddScoped<IApplicationUseCases, ApplicationUseCases>();
            builder.Services.AddScoped<ApplicationStatusHistoryUseCases>();
            builder.Services.AddScoped<CustomerUseCases>();
            builder.Services.AddScoped<DistrictUseCases>();
            builder.Services.AddScoped<ArchObjectUseCases>();
            builder.Services.AddScoped<uploaded_application_documentUseCases>();
            builder.Services.AddScoped<Iuploaded_application_documentUseCases, uploaded_application_documentUseCases>();
            builder.Services.AddScoped<application_paymentUseCases>();

            builder.Services.AddScoped<CustomerRepresentativeUseCases>();
            builder.Services.AddScoped<WorkflowUseCases>();
            builder.Services.AddScoped<WorkflowTaskTemplateUseCases>();
            builder.Services.AddScoped<WorkflowTaskDependencyUseCases>();
            builder.Services.AddScoped<WorkflowSubtaskTemplateUseCases>();
            builder.Services.AddScoped<task_statusUseCases>();
            builder.Services.AddScoped<application_subtaskUseCases>();
            builder.Services.AddScoped<application_task_assigneeUseCases>();
            builder.Services.AddScoped<application_taskUseCases>();
            builder.Services.AddScoped<contact_typeUseCases>();
            builder.Services.AddScoped<document_statusUseCases>();
            builder.Services.AddScoped<customer_contactUseCases>();
            builder.Services.AddScoped<organization_typeUseCases>();
            builder.Services.AddScoped<notificationUseCases>();
            builder.Services.AddScoped<TundukMinjustUseCase>();
            builder.Services.AddScoped<HistoryTableUseCases>();

            builder.Services.AddScoped<TagUseCases>();
            builder.Services.AddScoped<StructureReportUseCases>();
            builder.Services.AddScoped<StructureReportConfigUseCases>();
            builder.Services.AddScoped<StructureReportFieldUseCases>();
            builder.Services.AddScoped<StructureReportFieldConfigUseCases>();
            builder.Services.AddScoped<StructureReportStatusUseCases>();
            builder.Services.AddScoped<UnitForFieldConfigUseCases>();
            builder.Services.AddScoped<UnitTypeUseCases>();

            builder.Services.AddScoped<arch_object_tagUseCases>();
            builder.Services.AddScoped<saved_application_documentUseCases>();
            builder.Services.AddScoped<contragent_interaction_docUseCases>();
            builder.Services.AddScoped<contragent_interactionUseCases>();
            builder.Services.AddScoped<contragentUseCases>();
            builder.Services.AddScoped<application_subtask_assigneeUseCases>();
            builder.Services.AddScoped<task_typeUseCases>();
            builder.Services.AddScoped<ApplicationPaidInvoiceUseCases>();
            builder.Services.AddScoped<ApplicationWorkDocumentUseCases>();
            builder.Services.AddScoped<ApplicationStatusUseCases>();

            builder.Services.AddScoped<application_commentUseCases>();
            builder.Services.AddScoped<ApplicationRoadUseCases>();
            builder.Services.AddScoped<EmployeeEventUseCases>();
            builder.Services.AddScoped<HrmsEventTypeUseCases>();
            builder.Services.AddScoped<faq_questionUseCases>();

            builder.Services.AddScoped<CustomSubscribtionUseCase>();
            builder.Services.AddScoped<UploadedApplicationDocumentUseCases>();
            builder.Services.AddScoped<ScheduleTypeUseCase>();
            builder.Services.AddScoped<RepeatTypeUseCase>();
            builder.Services.AddScoped<UserLoginHistoryUseCases>();
            builder.Services.AddScoped<org_structure_templatesUseCases>();
            builder.Services.AddScoped<ArchiveLogStatusUseCases>();
            builder.Services.AddScoped<ArchiveLogUseCases>();

            builder.Services.AddScoped<telegram_subjectsUseCase>();
            builder.Services.AddScoped<telegram_questionsUseCase>();
            builder.Services.AddScoped<telegram_questions_chatsUseCase>();
            builder.Services.AddScoped<user_selectable_questions_telegramUseCase>();
            
            builder.Services.AddScoped<notification_templateUseCases>();
            builder.Services.AddScoped<MapUseCases>();
            builder.Services.AddScoped<notification_logUseCases>();
            builder.Services.AddScoped<ArchiveObjectUseCases>();
            builder.Services.AddScoped<ArchiveObjectFileUseCases>();
            builder.Services.AddScoped<structure_application_logUseCases>();
            builder.Services.AddScoped<identity_document_typeUseCases>();
            builder.Services.AddScoped<application_objectUseCases>();
            builder.Services.AddScoped<FeedbackUseCases>();
            builder.Services.AddScoped<reestrUseCases>();
            builder.Services.AddScoped<application_in_reestrUseCases>();
            builder.Services.AddScoped<reestr_statusUseCases>();
            builder.Services.AddScoped<CustomerDiscountUseCases>();
            builder.Services.AddScoped<CustomerDiscountDocumentsUseCases>();
            builder.Services.AddScoped<DiscountDocumentsUseCases>();
            builder.Services.AddScoped<DiscountDocumentTypeUseCases>();
            builder.Services.AddScoped<DiscountTypeUseCases>();
            builder.Services.AddScoped<object_tagUseCases>();
            builder.Services.AddScoped<structure_tag_applicationUseCases>();
            builder.Services.AddScoped<structure_tagUseCases>();
            builder.Services.AddScoped<ApplicationFilterUseCases>();
            builder.Services.AddScoped<ApplicationFilterTypeUseCases>();
            builder.Services.AddScoped<WorkDocumentTypeUseCases>();
            builder.Services.AddScoped<SystemSettingUseCases>();
            builder.Services.AddScoped<application_squareUseCases>();
            builder.Services.AddScoped<QueryFiltersUseCases>();

            builder.Services.AddScoped<architecture_statusUseCases>();
            builder.Services.AddScoped<archive_file_tagsUseCases>();
            builder.Services.AddScoped<architecture_processUseCases>();
            builder.Services.AddScoped<status_dutyplan_objectUseCases>();
            builder.Services.AddScoped<archirecture_roadUseCases>();
            builder.Services.AddScoped<application_duty_objectUseCases>();
            builder.Services.AddScoped<archive_doc_tagUseCases>();
            builder.Services.AddScoped<archive_folderUseCases>();
            builder.Services.AddScoped<tech_decisionUseCases>();
            builder.Services.AddScoped<CountryUseCases>();
            builder.Services.AddScoped<ArchiveObjectCustomerUseCases>();
            builder.Services.AddScoped<customers_for_archive_objectUseCases>();
            builder.Services.AddScoped<StructureTemplatesUseCases>();
            builder.Services.AddScoped<TechCouncilUseCases>();
            builder.Services.AddScoped<TechCouncilParticipantsSettingsUseCases>();
            builder.Services.AddScoped<DecisionTypeUseCases>();
            builder.Services.AddScoped<TechCouncilFilesUseCases>();
            builder.Services.AddScoped<ApplicationLegalRecordUseCases>();
            builder.Services.AddScoped<LegalRecordInCouncilUseCases>();
            builder.Services.AddScoped<legal_act_objectUseCases>();
            builder.Services.AddScoped<application_legal_recordUseCases>();
            builder.Services.AddScoped<legal_record_objectUseCases>();
            builder.Services.AddScoped<legal_record_registryUseCases>();
            builder.Services.AddScoped<legal_objectUseCases>();
            builder.Services.AddScoped<legal_registry_statusUseCases>();
            builder.Services.AddScoped<legal_act_registryUseCases>();
            builder.Services.AddScoped<legal_act_registry_statusUseCases>();
            builder.Services.AddScoped<LegalActEmployee>();
            builder.Services.AddScoped<LegalRecordEmployee>();

            builder.Services.AddScoped<releaseUseCases>();
            builder.Services.AddScoped<release_videoUseCases>();
            builder.Services.AddScoped<release_seenUseCases>();
            builder.Services.AddScoped<TechCouncilSessionUseCases>();
            builder.Services.AddScoped<ServicePriceUseCase>();
            builder.Services.AddScoped<DutyPlanLogUseCases>();
            builder.Services.AddScoped<application_stepUseCases>();
            builder.Services.AddScoped<application_pauseUseCases>();
            builder.Services.AddScoped<service_pathUseCases>();
            builder.Services.AddScoped<path_stepUseCases>();
            builder.Services.AddScoped<step_dependencyUseCases>();
            builder.Services.AddScoped<document_approverUseCases>();
            builder.Services.AddScoped<document_approvalUseCases>();
            builder.Services.AddScoped<step_required_documentUseCases>();
            builder.Services.AddScoped<step_partnerUseCases>();
            builder.Services.AddScoped<step_required_work_documentUseCases>();
            builder.Services.AddScoped<LawDocumentTypeUseCases>();
            builder.Services.AddScoped<LawDocumentUseCases>();
            builder.Services.AddScoped<StepStatusLogUseCases>();
            builder.Services.AddScoped<ApplicationRequiredCalcUseCases>();
            builder.Services.AddScoped<StepRequiredCalcUseCases>();
            builder.Services.AddScoped<ApplicationOutgoingDocumentUseCases>();
            builder.Services.AddScoped<DocumentJournalsUseCases>();
            builder.Services.AddScoped<ServiceStatusNumberingUseCases>();
            builder.Services.AddScoped<JournalPlaceholderUseCases>();
            builder.Services.AddScoped<JournalTemplateTypeUseCases>();
            builder.Services.AddScoped<JournalApplicationUseCases>();



            builder.Services.AddScoped<IWatermarkService, WatermarkService>();


            var app = builder.Build();

            app.UseStaticFiles();
            app.UseMiddlewareExtensions();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors(x => x
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin => true) // allow any origin
                .AllowCredentials());

            //app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            var eventBus = app.Services.GetRequiredService<IEventBus>();
            eventBus.Subscribe<ServiceRequestedEvent, ServiceRequestedEventHandler>();

            app.MapControllers();

            app.Run("http://*:5016");
        }
    }
}
