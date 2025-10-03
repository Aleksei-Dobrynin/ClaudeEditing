using System.Data;
using Application.Repositories;
using Domain.Entities;
using Infrastructure.Repositories;
using Infrastructure.Tunduk;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly IDbConnection _dbConnection;
        private readonly IDbConnection _mariadbConnection;
        private readonly IServiceProvider _serviceProvider;
        private bool hasMariaDbConnection;
        private IMariaDbRepository _mariaDbRepository;
        private IDbTransaction _dbTransaction;
        private IAuthRepository? _authRepository;
        private ISmProjectTypeRepository? _smProjectTypeRepository;
        private ISmProjectRepository? _smProjectRepository;
        private ISmProjectTagsRepository? _smProjectTagsRepository;
        private ICustomSvgIconRepository? _customSvgIconRepository;
        private ISurveyTagsRepository? _surveyTagsRepository;
        private IApplicationDocumentTypeRepository? _applicationDocumentTypeRepository;
        private IWorkDocumentTypeRepository? _workDocumentTypeRepository;
        private IApplicationDocumentRepository? _applicationDocumentRepository;
        private IWorkScheduleRepository? _WorkScheduleRepository;
        private IFileTypeForApplicationDocumentRepository? _fileTypeForApplicationDocumentRepository;
        private IFileForApplicationDocumentRepository? _fileForApplicationDocumentRepository;
        private IServiceDocumentRepository? _serviceDocumentRepository;
        private IServiceRepository? _serviceRepository;
        private IWorkScheduleExceptionRepository? _WorkScheduleExceptionRepository;
        private IWorkDayRepository? _WorkDayRepository;
        private IOrgStructureRepository? _OrgStructureRepository;
        private IFileRepository? _fileRepository;
        private IEmployeeInStructureRepository? _employeeInStructureRepository;
        private IEmployeeRepository? _employeeRepository;
        private Iemployee_contactRepository? _employee_contactRepository;
        private IRoleRepository? _roleRepository;
        private IUserRoleRepository? _userRoleRepository;
        private IStructurePostRepository? _structurePostRepository;
        private IcontragentRepository? _contragentRepository;
        private IApplicationStatusRepository? _applicationStatusRepository;
        private IApplicationStatusHistoryRepository? _applicationStatusHistoryRepository;
        private IApplicationRepository? _applicationRepository;
        private ICustomerRepository? _customerRepository;
        private IUploadedApplicationDocumentRepository? _uploadedApplicationDocumentRepository;

        private IS_DocumentTemplateTranslationRepository? _S_DocumentTemplateTranslationRepository;
        private IS_DocumentTemplateRepository? _S_DocumentTemplateRepository;
        private IS_TemplateDocumentPlaceholderRepository? _S_TemplateDocumentPlaceholderRepository;
        private IS_DocumentTemplateTypeRepository? _S_DocumentTemplateTypeRepository;
        private IS_PlaceHolderTemplateRepository? _S_PlaceHolderTemplateRepository;
        private ILanguageRepository? _LanguageRepository;
        private IS_QueriesDocumentTemplateRepository? _S_QueriesDocumentTemplateRepository;
        private IS_PlaceHolderTypeRepository? _S_PlaceHolderTypeRepository;
        private IS_QueryRepository? _S_QueryRepository;
        private IHostEnvironment _appEnvironment;
        private IDistrictRepository? _districtRepository;
        private IArchObjectRepository? _archObjectRepository;
        private Iuploaded_application_documentRepository? _uploaded_application_documentRepository;
        private Iapplication_paymentRepository? _application_paymentRepository;
        private ICustomerRepresentativeRepository? _customerRepresentativeRepository;
        private IWorkflowRepository _workflowRepository;
        private IWorkflowTaskTemplateRepository _workflowTaskTemplateRepository;
        private IWorkflowTaskDependencyRepository _workflowTaskDependencyRepository;
        private IWorkflowSubtaskTemplateRepository _workflowSubtaskTemplateRepository;
        private Itask_statusRepository? _task_statusRepository;
        private Iapplication_subtaskRepository? _application_subtaskRepository;
        private Iapplication_task_assigneeRepository? _application_task_assigneeRepository;
        private Iapplication_taskRepository? _application_taskRepository;
        private Icontact_typeRepository? _contact_typeRepository;
        private Icustomer_contactRepository? _customer_contactRepository;
        private Iorganization_typeRepository? _organization_typeRepository;
        private InotificationRepository? _notificationRepository;
        private IHistoryTableRepository? _historyTableRepository;
        private ITagRepository? _tagRepository;
        private IStructureReportRepository? _structureReportRepository;
        private IStructureReportConfigRepository? _structureReportConfigRepository;
        private IStructureReportFieldRepository? _structureReportFieldRepository;
        private IStructureReportFieldConfigRepository? _structureReportFieldConfigRepository;
        private IStructureReportStatusRepository? _structureReportStatusRepository;
        private IUnitForFieldConfigRepository? _unitForFieldConfigRepository;
        private IUnitTypeRepository? _unitTypeRepository;

        private Iarch_object_tagRepository? _arch_object_tagRepository;
        private Isaved_application_documentRepository? _saved_application_documentRepository;
        private IApplicationPaidInvoiceRepository? _applicationPaidInvoiceRepository;
        private Icontragent_interaction_docRepository? _contragent_interaction_docRepository;
        private Icontragent_interactionRepository? _contragent_interactionRepository;
        private Iapplication_subtask_assigneeRepository? _application_subtask_assigneeRepository;
        private Itask_typeRepository? _task_typeRepository;
        private IApplicationWorkDocumentRepository? _applicationWorkDocumentRepository;
        private Iapplication_commentRepository? _application_commentRepository;
        private IEmployeeEventRepository? _employeeEventRepository;
        private IHrmsEventTypeRepository? _hrmsEventTypeRepository;
        private IUserRepository? _userRepository;
        private IApplicationRoadRepository? _applicationRoadRepository;
        private Ifaq_questionRepository? _faq_questionRepository;
        private Iorg_structure_templatesRepository? _org_structure_templatesRepository;

        private ICustomSubscribtionRepository? _CustomSubscribtionRepository;
        private IScheduleTypeRepository? _ScheduleTypeRepository;
        private IRepeatTypeRepository? _RepeatTypeRepository;
        private IUserLoginHistoryRepository? _UserLoginHistoryRepository;

        private Itelegram_questionsRepository? _telegram_questionsRepository;
        private Itelegram_subjectsRepository? _telegram_subjectsRepository;
        private Itelegram_questions_fileRepository? _telegram_questions_fileRepository;
        private Itelegram_questions_chatsRepository? _telegram_questions_chatsRepository;
        private Iuser_selectable_questions_telegramRepository? _user_selectable_questions_telegramRepository;
        private Inotification_templateRepository? _notification_templateRepository;
        private Istructure_application_logRepository? _structure_application_logRepository;
        private Inotification_logRepository? _notification_logRepository;
        private IArchiveLogStatusRepository? _archiveLogStatusRepository;
        private IArchiveLogRepository? _archiveLogRepository;
        private IMapRepository? _mapRepository;
        private IArchiveObjectRepository? _archiveObjectRepository;
        private IArchiveObjectFileRepository? _archiveObjectFileRepository;
        private Iidentity_document_typeRepository? _identity_document_typeRepository;
        private Iapplication_objectRepository? _application_objectRepository;
        private IApplicationRoadGroupsRepository? _applicationRoadGroups;
        private IFeedbackRepository? _feedbackRepository;
        private IFeedbackFilesRepository? _feedbackFilesRepository;
        private IreestrRepository? _reestrRepository;
        private Iapplication_in_reestrRepository? _application_in_reestrRepository;
        private Ireestr_statusRepository? _reestr_statusRepository;
        private ICustomerDiscountRepository _customerDiscountRepository;
        private ICustomerDiscountDocumentsRepository _customerDiscountDocumentsRepository;
        private IDiscountDocumentTypeRepository _discountDocumentTypeRepository;
        private IDiscountDocumentsRepository _discountDocumentsRepository;
        private IDiscountTypeRepository _discountTypeRepository;
        private Iobject_tagRepository? _object_tagRepository;
        private Istructure_tag_applicationRepository? _structure_tag_applicationRepository;
        private Istructure_tagRepository? _structure_tagRepository;
        private IApplicationFilterRepository? _applicationFilterRepository;
        private IApplicationFilterTypeRepository _applicationFilterTypeRepository;
        private ISystemSettingRepository _systemSettingRepository;

        private Iapplication_squareRepository? _application_squareRepository;
        private IQueryFiltersRepository _queryFiltersRepository;
        private Iarchitecture_statusRepository? _architecture_statusRepository;
        private Iarchive_file_tagsRepository? _archive_file_tagsRepository;
        private Iarchitecture_processRepository? _architecture_processRepository;
        private Istatus_dutyplan_objectRepository? _status_dutyplan_objectRepository;
        private Iarchirecture_roadRepository? _archirecture_roadRepository;
        private Iapplication_duty_objectRepository? _application_duty_objectRepository;

        private Itech_decisionRepository? _tech_decisionRepository;
        private Iarchive_doc_tagRepository? _archive_doc_tagRepository;
        private Iarchive_folderRepository? _archive_folderRepository;
        private ICountryRepository _countryRepository;
        private IArchiveObjectCustomerRepository _archiveObjectCustomerRepository;
        private Icustomers_for_archive_objectRepository _customers_for_archive_objectRepository;
        private IStructureTemplatesRepository _structureTemplatesRepository;
        private ITechCouncilRepository _techCouncilRepository;
        private ITechCouncilParticipantsSettingsRepository _techCouncilParticipantsSettingsRepository;
        private IDecisionTypeRepository _decisionTypeRepository;
        private IApplicationLegalRecordRepository _applicationLegalRecordRepository;
        private ITechCouncilFilesRepository _techCouncilFilesRepository;
        private ILegalRecordInCouncilRepository _legalRecordInCouncilRepository;

        private Ilegal_act_objectRepository? _legal_act_objectRepository;
        private Iapplication_legal_recordRepository? _application_legal_recordRepository;
        private Ilegal_record_objectRepository? _legal_record_objectRepository;
        private Ilegal_record_registryRepository? _legal_record_registryRepository;
        private Ilegal_objectRepository? _legal_objectRepository;
        private Ilegal_registry_statusRepository? _legal_registry_statusRepository;
        private Ilegal_act_registryRepository? _legal_act_registryRepository;
        private Ilegal_act_registry_statusRepository? _legal_act_registry_statusRepository;
        private IreleaseRepository? _releaseRepository;
        private Irelease_videoRepository? _release_videoRepository;
        private Irelease_seenRepository? _release_seenRepository;

        private ILegalActEmployeeRepository? _legalActEmployeeRepository;
        private ILegalRecordEmployeeRepository? _legalRecordEmployeeRepository;
        private ITechCouncilSessionRepository? _techCouncilSessionRepository;

        private Inotification_log_statusRepository? _notification_log_statusRepository;
        private ISecurityEventRepository? _securityEventRepository;
        private IServicePriceRepository _servicePriceRepository;
        private IFileDownloadLogRepository? _fileDownloadLogRepository;
        private IDutyPlanLogRepository? _dutyPlanLogRepository;
        private Idocument_statusRepository? _document_statusRepository;
        private Iservice_pathRepository? _service_pathRepository;
        private Ipath_stepRepository? _path_stepRepository;
        private Istep_dependencyRepository? _step_dependencyRepository;
        private Idocument_approverRepository? _document_approverRepository;
        private Idocument_approvalRepository? _document_approvalRepository;
        private Istep_required_documentRepository? _step_required_documentRepository;
        private Istep_partnerRepository? _step_partnerRepository;
        private Iapplication_stepRepository? _application_stepRepository;
        private Iapplication_pauseRepository? _application_pauseRepository;
        private Istep_required_work_documentRepository? _step_required_work_documentRepository;
        private ILawDocumentTypeRepository? _lawDocumentTypeRepository;
        private ILawDocumentRepository? _lawDocumentRepository;
        private IStepStatusLogRepository? _stepStatusLogRepository;
        private IApplicationRequiredCalcRepository? _applicationRequiredCalcRepository;
        private IStepRequiredCalcRepository? _stepRequiredCalcRepository;
        private IApplicationInReestrCalcRepository? _applicationInReestrCalcRepository;
        private IApplicationInReestrPayedRepository? _applicationInReestrPayedRepository;
        private IApplicationOutgoingDocumentRepository? _applicationOutgoingDocumentRepository;
        private IDocumentJournalsRepository? _documentJournalsRepository;
        private IServiceStatusNumberingRepository? _serviceStatusNumberingRepository;
        private IJournalPlaceholderRepository? _journalPlaceholderRepository;
        private IJournalTemplateTypeRepository? _journalTemplateTypeRepository;
        private IJournalApplicationRepository? _journalApplicationRepository;
        private IAddressUnitTypeRepository? _addressUnitTypeRepository;
        private IAddressUnitRepository? _addressUnitRepository;
        private IStreetRepository? _streetRepository;
        private IStreetTypeRepository? _streetTypeRepository;
        private IEventTypeRepository? _eventTypeRepository;
        private IArchiveObjectsEventsRepository? _archiveObjectsEventsRepository;
        private IEmployeeSavedFiltersRepository? _employeeSavedFiltersRepository; 
        private ISmejPortalApiRepository? _smejPortalApiRepository; 

        private ILogger<UnitOfWork> _logger;
        private IConfiguration _configuration;

        public UnitOfWork(DapperDbContext context, MariaDbContext mariaDbcontext, IHostEnvironment appEnvironment, 
            IUserRepository userRepository, ILogger<UnitOfWork> logger, IServiceProvider serviceProvider, IConfiguration configuration)
        {
            _dbConnection = context.CreateConnection();
            _mariadbConnection = mariaDbcontext.CreateConnection();
            hasMariaDbConnection = mariaDbcontext.CheckHasMariaDbConnection();
            _dbConnection.Open();
            _dbTransaction = _dbConnection.BeginTransaction();
            _appEnvironment = appEnvironment;
            _userRepository = userRepository;
            _serviceProvider = serviceProvider;
            _logger = logger;
            _configuration = configuration;
        }


        public IMariaDbRepository MariaDbRepository
        {
            get
            {
                if (_mariaDbRepository == null)
                {
                    _mariaDbRepository = new MariaDbRepository(_mariadbConnection);
                }
                return _mariaDbRepository;
            }
        }
        public ISmProjectRepository SmProjectRepository
        {
            get
            {
                if (_smProjectRepository == null)
                {
                    _smProjectRepository = new SmProjectRepository(_dbConnection);
                    _smProjectRepository.SetTransaction(_dbTransaction);
                }
                return _smProjectRepository;
            }
        }

        public ISmProjectTypeRepository SmProjectTypeRepository
        {
            get
            {
                if (_smProjectTypeRepository == null)
                {
                    _smProjectTypeRepository = new SmProjectTypeRepository(_dbConnection);
                    _smProjectTypeRepository.SetTransaction(_dbTransaction);
                }
                return _smProjectTypeRepository;
            }
        }

        public ISmProjectTagsRepository SmProjectTagsRepository
        {
            get
            {
                if (_smProjectTagsRepository == null)
                {
                    _smProjectTagsRepository = new SmProjectTagsRepository(_dbConnection);
                    _smProjectTagsRepository.SetTransaction(_dbTransaction);
                }
                return _smProjectTagsRepository;
            }
        }

        public ICustomSvgIconRepository CustomSvgIconRepository
        {
            get
            {
                if (_customSvgIconRepository == null)
                {
                    _customSvgIconRepository = new CustomSvgIconRepository(_dbConnection, _userRepository);
                    _customSvgIconRepository.SetTransaction(_dbTransaction);
                }
                return _customSvgIconRepository;
            }
        }
        
        public ISurveyTagsRepository SurveyTagsRepository
        {
            get
            {
                if (_surveyTagsRepository == null)
                {
                    _surveyTagsRepository = new SurveyTagsRepository(_dbConnection);
                    _surveyTagsRepository.SetTransaction(_dbTransaction);
                }
                return _surveyTagsRepository;
            }
        }
        public IWorkScheduleRepository WorkScheduleRepository
        {
            get
            {
                if (_WorkScheduleRepository == null)
                {
                    _WorkScheduleRepository = new WorkScheduleRepository(_dbConnection, _userRepository);
                    _WorkScheduleRepository.SetTransaction(_dbTransaction);
                }
                return _WorkScheduleRepository;
            }
        }
        public IWorkScheduleExceptionRepository WorkScheduleExceptionRepository
        {
            get
            {
                if (_WorkScheduleExceptionRepository == null)
                {
                    _WorkScheduleExceptionRepository = new WorkScheduleExceptionRepository(_dbConnection, _userRepository);
                    _WorkScheduleExceptionRepository.SetTransaction(_dbTransaction);
                }
                return _WorkScheduleExceptionRepository;
            }
        }
        public IWorkDayRepository WorkDayRepository
        {
            get
            {
                if (_WorkDayRepository == null)
                {
                    _WorkDayRepository = new WorkDayRepository(_dbConnection, _userRepository);
                    _WorkDayRepository.SetTransaction(_dbTransaction);
                }
                return _WorkDayRepository;
            }
        }
        public IOrgStructureRepository OrgStructureRepository
        {
            get
            {
                if (_OrgStructureRepository == null)
                {
                    _OrgStructureRepository = new OrgStructureRepository(_dbConnection, _userRepository);
                    _OrgStructureRepository.SetTransaction(_dbTransaction);
                }
                return _OrgStructureRepository;
            }
        }

        public IS_DocumentTemplateTranslationRepository S_DocumentTemplateTranslationRepository
        {
            get
            {
                if (_S_DocumentTemplateTranslationRepository == null)
                {
                    _S_DocumentTemplateTranslationRepository = new S_DocumentTemplateTranslationRepository(_dbConnection, _userRepository);
                    _S_DocumentTemplateTranslationRepository.SetTransaction(_dbTransaction);
                }
                return _S_DocumentTemplateTranslationRepository;
            }
        }
        public IS_DocumentTemplateRepository S_DocumentTemplateRepository
        {
            get
            {
                if (_S_DocumentTemplateRepository == null)
                {
                    _S_DocumentTemplateRepository = new S_DocumentTemplateRepository(_dbConnection, _userRepository);
                    _S_DocumentTemplateRepository.SetTransaction(_dbTransaction);
                }
                return _S_DocumentTemplateRepository;
            }
        }
        public IS_TemplateDocumentPlaceholderRepository S_TemplateDocumentPlaceholderRepository
        {
            get
            {
                if (_S_TemplateDocumentPlaceholderRepository == null)
                {
                    _S_TemplateDocumentPlaceholderRepository = new S_TemplateDocumentPlaceholderRepository(_dbConnection, _userRepository);
                    _S_TemplateDocumentPlaceholderRepository.SetTransaction(_dbTransaction);
                }
                return _S_TemplateDocumentPlaceholderRepository;
            }
        }
        public IS_DocumentTemplateTypeRepository S_DocumentTemplateTypeRepository
        {
            get
            {
                if (_S_DocumentTemplateTypeRepository == null)
                {
                    _S_DocumentTemplateTypeRepository = new S_DocumentTemplateTypeRepository(_dbConnection, _userRepository);
                    _S_DocumentTemplateTypeRepository.SetTransaction(_dbTransaction);
                }
                return _S_DocumentTemplateTypeRepository;
            }
        }
        public IS_PlaceHolderTemplateRepository S_PlaceHolderTemplateRepository
        {
            get
            {
                if (_S_PlaceHolderTemplateRepository == null)
                {
                    _S_PlaceHolderTemplateRepository = new S_PlaceHolderTemplateRepository(_dbConnection, _userRepository);
                    _S_PlaceHolderTemplateRepository.SetTransaction(_dbTransaction);
                }
                return _S_PlaceHolderTemplateRepository;
            }
        }
        public ILanguageRepository LanguageRepository
        {
            get
            {
                if (_LanguageRepository == null)
                {
                    _LanguageRepository = new LanguageRepository(_dbConnection, _userRepository);
                    _LanguageRepository.SetTransaction(_dbTransaction);
                }
                return _LanguageRepository;
            }
        }
        public IS_QueriesDocumentTemplateRepository S_QueriesDocumentTemplateRepository
        {
            get
            {
                if (_S_QueriesDocumentTemplateRepository == null)
                {
                    _S_QueriesDocumentTemplateRepository = new S_QueriesDocumentTemplateRepository(_dbConnection, _userRepository);
                    _S_QueriesDocumentTemplateRepository.SetTransaction(_dbTransaction);
                }
                return _S_QueriesDocumentTemplateRepository;
            }
        }
        public IS_PlaceHolderTypeRepository S_PlaceHolderTypeRepository
        {
            get
            {
                if (_S_PlaceHolderTypeRepository == null)
                {
                    _S_PlaceHolderTypeRepository = new S_PlaceHolderTypeRepository(_dbConnection, _userRepository);
                    _S_PlaceHolderTypeRepository.SetTransaction(_dbTransaction);
                }
                return _S_PlaceHolderTypeRepository;
            }
        }
        public IS_QueryRepository S_QueryRepository
        {
            get
            {
                if (_S_QueryRepository == null)
                {
                    _S_QueryRepository = _serviceProvider.GetRequiredService<IS_QueryRepository>();
                    // _S_QueryRepository = new S_QueryRepository(_dbConnection, _userRepository);
                    _S_QueryRepository.SetTransaction(_dbTransaction);
                }
                return _S_QueryRepository;
            }
        }

        public IApplicationDocumentTypeRepository ApplicationDocumentTypeRepository
        {
            get
            {
                if (_applicationDocumentTypeRepository == null)
                {
                    _applicationDocumentTypeRepository = new ApplicationDocumentTypeRepository(_dbConnection, _userRepository);
                    _applicationDocumentTypeRepository.SetTransaction(_dbTransaction);
                }
                return _applicationDocumentTypeRepository;
            }
        }

        public IWorkDocumentTypeRepository WorkDocumentTypeRepository
        {
            get
            {
                if (_workDocumentTypeRepository == null)
                {
                    _workDocumentTypeRepository = new WorkDocumentTypeRepository(_dbConnection);
                    _workDocumentTypeRepository.SetTransaction(_dbTransaction);
                }
                return _workDocumentTypeRepository;
            }
        }

        public IApplicationDocumentRepository ApplicationDocumentRepository
        {
            get
            {
                if (_applicationDocumentRepository == null)
                {
                    _applicationDocumentRepository = new ApplicationDocumentRepository(_dbConnection, _userRepository);
                    _applicationDocumentRepository.SetTransaction(_dbTransaction);
                }
                return _applicationDocumentRepository;
            }
        }
        
        public IFileTypeForApplicationDocumentRepository FileTypeForApplicationDocumentRepository
        {
            get
            {
                if (_fileTypeForApplicationDocumentRepository == null)
                {
                    _fileTypeForApplicationDocumentRepository = new FileTypeForApplicationDocumentRepository(_dbConnection, _userRepository);
                    _fileTypeForApplicationDocumentRepository.SetTransaction(_dbTransaction);
                }
                return _fileTypeForApplicationDocumentRepository;
            }
        }
        
        public IFileForApplicationDocumentRepository FileForApplicationDocumentRepository
        {
            get
            {
                if (_fileForApplicationDocumentRepository == null)
                {
                    _fileForApplicationDocumentRepository = new FileForApplicationDocumentRepository(_dbConnection, _userRepository);
                    _fileForApplicationDocumentRepository.SetTransaction(_dbTransaction);
                }
                return _fileForApplicationDocumentRepository;
            }
        }
        
        public IServiceDocumentRepository ServiceDocumentRepository
        {
            get
            {
                if (_serviceDocumentRepository == null)
                {
                    _serviceDocumentRepository = new ServiceDocumentRepository(_dbConnection, _userRepository);
                    _serviceDocumentRepository.SetTransaction(_dbTransaction);
                }
                return _serviceDocumentRepository;
            }
        }
        
        public IServiceRepository ServiceRepository
        {
            get
            {
                if (_serviceRepository == null)
                {
                    _serviceRepository = new ServiceRepository(_dbConnection, _userRepository);
                    _serviceRepository.SetTransaction(_dbTransaction);

                }
                return _serviceRepository;
            }
        }
        
        public IFileRepository FileRepository
        {
            get
            {
                if (_fileRepository == null)
                {
                    _fileRepository = new FileRepository(_dbConnection, _appEnvironment, _userRepository);
                    _fileRepository.SetTransaction(_dbTransaction);
                }
                return _fileRepository;
            }
        }
        
        public IEmployeeInStructureRepository EmployeeInStructureRepository
        {
            get
            {
                if (_employeeInStructureRepository == null)
                {
                    _employeeInStructureRepository = new EmployeeInStructureRepository(_dbConnection, _userRepository);
                    _employeeInStructureRepository.SetTransaction(_dbTransaction);
                }
                return _employeeInStructureRepository;
            }
        }
        
        public IEmployeeRepository EmployeeRepository
        {
            get
            {
                if (_employeeRepository == null)
                {
                    _employeeRepository = new EmployeeRepository(_dbConnection, _userRepository);
                    _employeeRepository.SetTransaction(_dbTransaction);
                }
                return _employeeRepository;
            }
        }        
        
        public Iemployee_contactRepository employee_contactRepository
        {
            get
            {
                if (_employee_contactRepository == null)
                {
                    _employee_contactRepository = new employee_contactRepository(_dbConnection, _userRepository);
                    _employee_contactRepository.SetTransaction(_dbTransaction);
                }
                return _employee_contactRepository;
            }
        }
        
        public IRoleRepository RoleRepository
        {
            get
            {
                if (_roleRepository == null)
                {
                    _roleRepository = new RoleRepository(_dbConnection, _userRepository);
                    _roleRepository.SetTransaction(_dbTransaction);
                }
                return _roleRepository;
            }
        }
        
        public IUserRoleRepository UserRoleRepository
        {
            get
            {
                if (_userRoleRepository == null)
                {
                    _userRoleRepository = new UserRoleRepository(_dbConnection, _userRepository);
                    _userRoleRepository.SetTransaction(_dbTransaction);
                }
                return _userRoleRepository;
            }
        }
        
        public IStructurePostRepository StructurePostRepository
        {
            get
            {
                if (_structurePostRepository == null)
                {
                    _structurePostRepository = new StructurePostRepository(_dbConnection, _userRepository);
                    _structurePostRepository.SetTransaction(_dbTransaction);
                }
                return _structurePostRepository;
            }
        }

        public IcontragentRepository contragentRepository
        {
            get
            {
                if (_contragentRepository == null)
                {
                    _contragentRepository = new contragentRepository(_dbConnection, _userRepository);
                    _contragentRepository.SetTransaction(_dbTransaction);
                }
                return _contragentRepository;
            }
        }

        public IApplicationStatusRepository ApplicationStatusRepository
        {
            get
            {
                if (_applicationStatusRepository == null)
                {
                    _applicationStatusRepository = new ApplicationStatusRepository(_dbConnection, _userRepository);
                    _applicationStatusRepository.SetTransaction(_dbTransaction);
                }
                return _applicationStatusRepository;
            }
        }

        public IApplicationStatusHistoryRepository ApplicationStatusHistoryRepository
        {
            get
            {
                if (_applicationStatusHistoryRepository == null)
                {
                    _applicationStatusHistoryRepository = new ApplicationStatusHistoryRepository(_dbConnection, _userRepository);
                    _applicationStatusHistoryRepository.SetTransaction(_dbTransaction);
                }
                return _applicationStatusHistoryRepository;
            }
        }

        public IApplicationRepository ApplicationRepository
        {
            get
            {
                if (_applicationRepository == null)
                {
                    _applicationRepository = new ApplicationRepository(_dbConnection, _userRepository);
                    _applicationRepository.SetTransaction(_dbTransaction);
                }
                return _applicationRepository;
            }
        }
        
        public ICustomerRepository CustomerRepository
        {
            get
            {
                if (_customerRepository == null)
                {
                    _customerRepository = new CustomerRepository(_dbConnection, _userRepository);
                    _customerRepository.SetTransaction(_dbTransaction);
                }
                return _customerRepository;
            }
        }
        
        public IArchObjectRepository ArchObjectRepository
        {
            get
            {
                if (_archObjectRepository == null)
                {
                    _archObjectRepository = new ArchObjectRepository(_dbConnection, _userRepository);
                    _archObjectRepository.SetTransaction(_dbTransaction);
                }
                return _archObjectRepository;
            }
        }
        public IUploadedApplicationDocumentRepository UploadedApplicationDocumentRepository
        {
            get
            {
                if (_uploadedApplicationDocumentRepository == null)
                {
                    _uploadedApplicationDocumentRepository = new UploadedApplicationDocumentRepository(_dbConnection);
                    _uploadedApplicationDocumentRepository.SetTransaction(_dbTransaction);
                }
                return _uploadedApplicationDocumentRepository;
            }
        }
        public IDistrictRepository DistrictRepository
        {
            get
            {
                if (_districtRepository == null)
                {
                    _districtRepository = new DistrictRepository(_dbConnection, _userRepository);
                    _districtRepository.SetTransaction(_dbTransaction);
                }
                return _districtRepository;
            }
        }
        public Iuploaded_application_documentRepository uploaded_application_documentRepository
        {
            get
            {
                if (_uploaded_application_documentRepository == null)
                {
                    _uploaded_application_documentRepository = new uploaded_application_documentRepository(_dbConnection, _userRepository);
                    _uploaded_application_documentRepository.SetTransaction(_dbTransaction);
                }
                return _uploaded_application_documentRepository;
            }
        }
        
        public ICustomerRepresentativeRepository CustomerRepresentativeRepository
        {
            get
            {
                if (_customerRepresentativeRepository == null)
                {
                    _customerRepresentativeRepository = new CustomerRepresentativeRepository(_dbConnection, _userRepository);
                    _customerRepresentativeRepository.SetTransaction(_dbTransaction);
                }
                return _customerRepresentativeRepository;
            }
        }
        
        public IWorkflowRepository WorkflowRepository
        {
            get
            {
                if (_workflowRepository == null)
                {
                    _workflowRepository = new WorkflowRepository(_dbConnection, _userRepository);
                    _workflowRepository.SetTransaction(_dbTransaction);
                }
                return _workflowRepository;
            }
        }
        
        public IWorkflowTaskTemplateRepository WorkflowTaskTemplateRepository
        {
            get
            {
                if (_workflowTaskTemplateRepository == null)
                {
                    _workflowTaskTemplateRepository = new WorkflowTaskTemplateRepository(_dbConnection, _userRepository);
                    _workflowTaskTemplateRepository.SetTransaction(_dbTransaction);
                }
                return _workflowTaskTemplateRepository;
            }
        }
        
        public IWorkflowTaskDependencyRepository WorkflowTaskDependencyRepository
        {
            get
            {
                if (_workflowTaskDependencyRepository == null)
                {
                    _workflowTaskDependencyRepository = new WorkflowTaskDependencyRepository(_dbConnection, _userRepository);
                    _workflowTaskDependencyRepository.SetTransaction(_dbTransaction);
                }
                return _workflowTaskDependencyRepository;
            }
        }
        
        public IWorkflowSubtaskTemplateRepository WorkflowSubtaskTemplateRepository
        {
            get
            {
                if (_workflowSubtaskTemplateRepository == null)
                {
                    _workflowSubtaskTemplateRepository = new WorkflowSubtaskTemplateRepository(_dbConnection, _userRepository);
                    _workflowSubtaskTemplateRepository.SetTransaction(_dbTransaction);
                }
                return _workflowSubtaskTemplateRepository;
            }
        }
        public Iapplication_paymentRepository application_paymentRepository
        {
            get
            {
                if (_application_paymentRepository == null)
                {
                    _application_paymentRepository = new application_paymentRepository(_dbConnection, _userRepository);
                    _application_paymentRepository.SetTransaction(_dbTransaction);
                }
                return _application_paymentRepository;
            }
        }
        public Itask_statusRepository task_statusRepository
        {
            get
            {
                if (_task_statusRepository == null)
                {
                    _task_statusRepository = new task_statusRepository(_dbConnection, _userRepository);
                    _task_statusRepository.SetTransaction(_dbTransaction);
                }
                return _task_statusRepository;
            }
        }
        public Iapplication_subtaskRepository application_subtaskRepository
        {
            get
            {
                if (_application_subtaskRepository == null)
                {
                    _application_subtaskRepository = new application_subtaskRepository(_dbConnection, _userRepository);
                    _application_subtaskRepository.SetTransaction(_dbTransaction);
                }
                return _application_subtaskRepository;
            }
        }
        public Iapplication_task_assigneeRepository application_task_assigneeRepository
        {
            get
            {
                if (_application_task_assigneeRepository == null)
                {
                    _application_task_assigneeRepository = new application_task_assigneeRepository(_dbConnection, _userRepository);
                    _application_task_assigneeRepository.SetTransaction(_dbTransaction);
                }
                return _application_task_assigneeRepository;
            }
        }
        public Iapplication_taskRepository application_taskRepository
        {
            get
            {
                if (_application_taskRepository == null)
                {
                    _application_taskRepository = new application_taskRepository(_dbConnection, _userRepository);
                    _application_taskRepository.SetTransaction(_dbTransaction);
                }
                return _application_taskRepository;
            }
        }
        public Icontact_typeRepository contact_typeRepository
        {
            get
            {
                if (_contact_typeRepository == null)
                {
                    _contact_typeRepository = new contact_typeRepository(_dbConnection, _userRepository);
                    _contact_typeRepository.SetTransaction(_dbTransaction);
                }
                return _contact_typeRepository;
            }
        }
        public Icustomer_contactRepository customer_contactRepository
        {
            get
            {
                if (_customer_contactRepository == null)
                {
                    _customer_contactRepository = new customer_contactRepository(_dbConnection, _userRepository);
                    _customer_contactRepository.SetTransaction(_dbTransaction);
                }
                return _customer_contactRepository;
            }
        }
        public Iorganization_typeRepository organization_typeRepository
        {
            get
            {
                if (_organization_typeRepository == null)
                {
                    _organization_typeRepository = new organization_typeRepository(_dbConnection, _userRepository);
                    _organization_typeRepository.SetTransaction(_dbTransaction);
                }
                return _organization_typeRepository;
            }
        }
        public InotificationRepository notificationRepository
        {
            get
            {
                if (_notificationRepository == null)
                {
                    _notificationRepository = new notificationRepository(_dbConnection, _userRepository);
                    _notificationRepository.SetTransaction(_dbTransaction);
                }
                return _notificationRepository;
            }
        }

        public IHistoryTableRepository HistoryTableRepository
        {
            get
            {
                if (_historyTableRepository == null)
                {
                    _historyTableRepository = new HistoryTableRepository(_dbConnection);
                    _historyTableRepository.SetTransaction(_dbTransaction);
                }
                return _historyTableRepository;
            }
        }

        public ITagRepository TagRepository
        {
            get
            {
                if (_tagRepository == null)
                {
                    _tagRepository = new TagRepository(_dbConnection, _userRepository);
                    _tagRepository.SetTransaction(_dbTransaction);
                }
                return _tagRepository;
            }
        }

        public IStructureReportRepository StructureReportRepository
        {
            get
            {
                if (_structureReportRepository == null)
                {
                    _structureReportRepository = new StructureReportRepository(_dbConnection);
                    _structureReportRepository.SetTransaction(_dbTransaction);
                }
                return _structureReportRepository;
            }
        }

        public IStructureReportConfigRepository StructureReportConfigRepository
        {
            get
            {
                if (_structureReportConfigRepository == null)
                {
                    _structureReportConfigRepository = new StructureReportConfigRepository(_dbConnection);
                    _structureReportConfigRepository.SetTransaction(_dbTransaction);
                }
                return _structureReportConfigRepository;
            }
        }

        public IStructureReportFieldRepository StructureReportFieldRepository
        {
            get
            {
                if (_structureReportFieldRepository == null)
                {
                    _structureReportFieldRepository = new StructureReportFieldRepository(_dbConnection);
                    _structureReportFieldRepository.SetTransaction(_dbTransaction);
                }
                return _structureReportFieldRepository;
            }
        }


        public IStructureReportFieldConfigRepository StructureReportFieldConfigRepository
        {
            get
            {
                if (_structureReportFieldConfigRepository == null)
                {
                    _structureReportFieldConfigRepository = new StructureReportFieldConfigRepository(_dbConnection);
                    _structureReportFieldConfigRepository.SetTransaction(_dbTransaction);
                }
                return _structureReportFieldConfigRepository;
            }
        }

        public IStructureReportStatusRepository StructureReportStatusRepository
        {
            get
            {
                if (_structureReportStatusRepository == null)
                {
                    _structureReportStatusRepository = new StructureReportStatusRepository(_dbConnection, _userRepository);
                    _structureReportStatusRepository.SetTransaction(_dbTransaction);
                }
                return _structureReportStatusRepository;
            }
        }

        public IUnitForFieldConfigRepository UnitForFieldConfigRepository
        {
            get
            {
                if (_unitForFieldConfigRepository == null)
                {
                    _unitForFieldConfigRepository = new UnitForFieldConfigRepository(_dbConnection);
                    _unitForFieldConfigRepository.SetTransaction(_dbTransaction);
                }
                return _unitForFieldConfigRepository;
            }
        }

        public IUnitTypeRepository UnitTypeRepository
        {
            get
            {
                if (_unitTypeRepository == null)
                {
                    _unitTypeRepository = new UnitTypeRepository(_dbConnection);
                    _unitTypeRepository.SetTransaction(_dbTransaction);
                }
                return _unitTypeRepository;
            }
        }


        public Iarch_object_tagRepository arch_object_tagRepository
        {
            get
            {
                if (_arch_object_tagRepository == null)
                {
                    _arch_object_tagRepository = new arch_object_tagRepository(_dbConnection, _userRepository);
                    _arch_object_tagRepository.SetTransaction(_dbTransaction);
                }
                return _arch_object_tagRepository;
            }
        }
        public Isaved_application_documentRepository saved_application_documentRepository
        {
            get
            {
                if (_saved_application_documentRepository == null)
                {
                    _saved_application_documentRepository = new saved_application_documentRepository(_dbConnection, _userRepository);
                    _saved_application_documentRepository.SetTransaction(_dbTransaction);
                }
                return _saved_application_documentRepository;
            }
        }
        public IApplicationPaidInvoiceRepository ApplicationPaidInvoiceRepository
        {
            get
            {
                if (_applicationPaidInvoiceRepository == null)
                {
                    _applicationPaidInvoiceRepository = new ApplicationPaidInvoiceRepository(_dbConnection, _userRepository);
                    _applicationPaidInvoiceRepository.SetTransaction(_dbTransaction);
                }
                return _applicationPaidInvoiceRepository;
            }
        }

        public Iapplication_commentRepository application_commentRepository
        {
            get
            {
                if (_application_commentRepository == null)
                {
                    _application_commentRepository = new application_commentRepository(_dbConnection, _userRepository);
                    _application_commentRepository.SetTransaction(_dbTransaction);
                }
                return _application_commentRepository;
            }
        }


        public Icontragent_interaction_docRepository contragent_interaction_docRepository
        {
            get
            {
                if (_contragent_interaction_docRepository == null)
                {
                    _contragent_interaction_docRepository = new contragent_interaction_docRepository(_dbConnection, _userRepository);
                    _contragent_interaction_docRepository.SetTransaction(_dbTransaction);
                }
                return _contragent_interaction_docRepository;
            }
        }
        public Icontragent_interactionRepository contragent_interactionRepository
        {
            get
            {
                if (_contragent_interactionRepository == null)
                {
                    _contragent_interactionRepository = new contragent_interactionRepository(_dbConnection, _userRepository);
                    _contragent_interactionRepository.SetTransaction(_dbTransaction);
                }
                return _contragent_interactionRepository;
            }
        }
        public Iapplication_subtask_assigneeRepository application_subtask_assigneeRepository
        {
            get
            {
                if (_application_subtask_assigneeRepository == null)
                {
                    _application_subtask_assigneeRepository = new application_subtask_assigneeRepository(_dbConnection, _userRepository);
                    _application_subtask_assigneeRepository.SetTransaction(_dbTransaction);
                }
                return _application_subtask_assigneeRepository;
            }
        }
        public Itask_typeRepository task_typeRepository
        {
            get
            {
                if (_task_typeRepository == null)
                {
                    _task_typeRepository = new task_typeRepository(_dbConnection, _userRepository);
                    _task_typeRepository.SetTransaction(_dbTransaction);
                }
                return _task_typeRepository;
            }
        }
        
        public IEmployeeEventRepository EmployeeEventRepository
        {
            get
            {
                if (_employeeEventRepository == null)
                {
                    _employeeEventRepository = new EmployeeEventRepository(_dbConnection, _userRepository);
                    _employeeEventRepository.SetTransaction(_dbTransaction);
                }
                return _employeeEventRepository;
            }
        }
        public IHrmsEventTypeRepository HrmsEventTypeRepository
        {
            get
            {
                if (_hrmsEventTypeRepository == null)
                {
                    _hrmsEventTypeRepository = new HrmsEventTypeRepository(_dbConnection, _userRepository);
                    _hrmsEventTypeRepository.SetTransaction(_dbTransaction);
                }
                return _hrmsEventTypeRepository;
            }
        }

        public IApplicationWorkDocumentRepository ApplicationWorkDocumentRepository
        {
            get
            {
                if (_applicationWorkDocumentRepository == null)
                {
                    _applicationWorkDocumentRepository = new ApplicationWorkDocumentRepository(_dbConnection, _userRepository);
                    _applicationWorkDocumentRepository.SetTransaction(_dbTransaction);
                }
                return _applicationWorkDocumentRepository;
            }
        }
        
        public IApplicationRoadRepository ApplicationRoadRepository
        {
            get
            {
                if (_applicationRoadRepository == null)
                {
                    _applicationRoadRepository = new ApplicationRoadRepository(_dbConnection, _userRepository);
                    _applicationRoadRepository.SetTransaction(_dbTransaction);
                }
                return _applicationRoadRepository;
            }
        }

        public Ifaq_questionRepository faq_questionRepository
        {
            get
            {
                if (_faq_questionRepository == null)
                {
                    _faq_questionRepository = new faq_questionRepository(_dbConnection, _userRepository);
                    _faq_questionRepository.SetTransaction(_dbTransaction);
                }
                return _faq_questionRepository;
            }
        }

        public IUserRepository UserRepository
        {
            get
            {
                if (_userRepository == null)
                {
                    _userRepository = new UserRepository(_dbConnection, _authRepository);
                    _userRepository.SetTransaction(_dbTransaction);
                }
                return _userRepository;
            }
        }
        public Iorg_structure_templatesRepository org_structure_templatesRepository
        {
            get
            {
                if (_org_structure_templatesRepository == null)
                {
                    _org_structure_templatesRepository = new org_structure_templatesRepository(_dbConnection, _userRepository);
                    _org_structure_templatesRepository.SetTransaction(_dbTransaction);
                }
                return _org_structure_templatesRepository;
            }
        }

        public ICustomSubscribtionRepository CustomSubscribtionRepository
        {
            get
            {
                if (_CustomSubscribtionRepository == null)
                {
                    _CustomSubscribtionRepository = new CustomSubscribtionRepository(_dbConnection, _userRepository);
                    _CustomSubscribtionRepository.SetTransaction(_dbTransaction);
                }
                return _CustomSubscribtionRepository;
            }
        }
        public IScheduleTypeRepository ScheduleTypeRepository
        {
            get
            {
                if (_ScheduleTypeRepository == null)
                {
                    _ScheduleTypeRepository = new ScheduleTypeRepository(_dbConnection, _userRepository);
                    _ScheduleTypeRepository.SetTransaction(_dbTransaction);
                }
                return _ScheduleTypeRepository;
            }
        }


        public IRepeatTypeRepository RepeatTypeRepository
        {
            get
            {
                if (_RepeatTypeRepository == null)
                {
                    _RepeatTypeRepository = new RepeatTypeRepository(_dbConnection, _userRepository);
                    _RepeatTypeRepository.SetTransaction(_dbTransaction);
                }
                return _RepeatTypeRepository;
            }
        }
        
        public IUserLoginHistoryRepository UserLoginHistoryRepository
        {
            get
            {
                if (_UserLoginHistoryRepository == null)
                {
                    _UserLoginHistoryRepository = new UserLoginHistoryRepository(_dbConnection);
                    _UserLoginHistoryRepository.SetTransaction(_dbTransaction);
                }
                return _UserLoginHistoryRepository;
            }
        }

        public IMapRepository MapRepository {
            get
            {
                if (_mapRepository == null)
                {
                    _mapRepository = new MapRepository(_dbConnection);
                    _mapRepository.SetTransaction(_dbTransaction);
                }
                return _mapRepository;
            }
        }

        public Itelegram_subjectsRepository telegram_subjectsRepository
        {
            get
            {
                if (_telegram_subjectsRepository == null)
                {
                    _telegram_subjectsRepository = new telegram_subjectsRepository(_dbConnection);
                    _telegram_subjectsRepository.SetTransaction(_dbTransaction);
                }
                return _telegram_subjectsRepository;
            }
        }

        public Itelegram_questionsRepository telegram_questionsRepository
        {
            get
            {
                if (_telegram_questionsRepository == null)
                {
                    _telegram_questionsRepository = new telegram_questionsRepository(_dbConnection);
                    _telegram_questionsRepository.SetTransaction(_dbTransaction);
                }
                return _telegram_questionsRepository;
            }
        }

        public Itelegram_questions_fileRepository telegram_questions_fileRepository
        {
            get
            {
                if (_telegram_questions_fileRepository == null)
                {
                    _telegram_questions_fileRepository = new telegram_questions_fileRepository(_dbConnection);
                    _telegram_questions_fileRepository.SetTransaction(_dbTransaction);
                }
                return _telegram_questions_fileRepository;
            }
        }

        public Itelegram_questions_chatsRepository telegram_questions_chatsRepository
        {
            get
            {
                if (_telegram_questions_chatsRepository == null)
                {
                    _telegram_questions_chatsRepository = new telegram_questions_chatsRepository(_dbConnection);
                    _telegram_questions_chatsRepository.SetTransaction(_dbTransaction);
                }
                return _telegram_questions_chatsRepository;
            }
        }
        public Iuser_selectable_questions_telegramRepository user_selectable_questions_telegramRepository
        {
            get
            {
                if (_user_selectable_questions_telegramRepository == null)
                {
                    _user_selectable_questions_telegramRepository = new user_selectable_questions_telegramRepository(_dbConnection);
                    _user_selectable_questions_telegramRepository.SetTransaction(_dbTransaction);
                }
                return _user_selectable_questions_telegramRepository;
            }
        }

        public Inotification_templateRepository notification_templateRepository
        {
            get
            {
                if (_notification_templateRepository == null)
                {
                    _notification_templateRepository = new notification_templateRepository(_dbConnection, _userRepository);
                    _notification_templateRepository.SetTransaction(_dbTransaction);
                }
                return _notification_templateRepository;
            }
        }

        public Inotification_logRepository notification_logRepository
        {
            get
            {
                if (_notification_logRepository == null)
                {
                    _notification_logRepository = new notification_logRepository(_dbConnection, _userRepository);
                    _notification_logRepository.SetTransaction(_dbTransaction);
                }
                return _notification_logRepository;
            }
        }
        
        public IArchiveObjectRepository ArchiveObjectRepository
        {
            get
            {
                if (_archiveObjectRepository == null)
                {
                    _archiveObjectRepository = new ArchiveObjectRepository(_dbConnection, _userRepository);
                    _archiveObjectRepository.SetTransaction(_dbTransaction);
                }
                return _archiveObjectRepository;
            }
        }
        
        public IArchiveObjectFileRepository ArchiveObjectFileRepository
        {
            get
            {
                if (_archiveObjectFileRepository == null)
                {
                    _archiveObjectFileRepository = new ArchiveObjectFileRepository(_dbConnection, _userRepository);
                    _archiveObjectFileRepository.SetTransaction(_dbTransaction);
                }
                return _archiveObjectFileRepository;
            }
        }
        
        public IArchiveLogStatusRepository ArchiveLogStatusRepository
        {
            get
            {
                if (_archiveLogStatusRepository == null)
                {
                    _archiveLogStatusRepository = new ArchiveLogStatusRepository(_dbConnection, _userRepository);
                    _archiveLogStatusRepository.SetTransaction(_dbTransaction);
                }
                return _archiveLogStatusRepository;
            }
        }
        
        public IArchiveLogRepository ArchiveLogRepository
        {
            get
            {
                if (_archiveLogRepository == null)
                {
                    _archiveLogRepository = new ArchiveLogRepository(_dbConnection, _userRepository);
                    _archiveLogRepository.SetTransaction(_dbTransaction);
                }
                return _archiveLogRepository;
            }
        }
        public Istructure_application_logRepository structure_application_logRepository
        {
            get
            {
                if (_structure_application_logRepository == null)
                {
                    _structure_application_logRepository = new structure_application_logRepository(_dbConnection, _userRepository);
                    _structure_application_logRepository.SetTransaction(_dbTransaction);
                }
                return _structure_application_logRepository;
            }
        }
        public Iidentity_document_typeRepository identity_document_typeRepository
        {
            get
            {
                if (_identity_document_typeRepository == null)
                {
                    _identity_document_typeRepository = new identity_document_typeRepository(_dbConnection, _userRepository);
                    _identity_document_typeRepository.SetTransaction(_dbTransaction);
                }
                return _identity_document_typeRepository;
            }
        }
        public Iapplication_objectRepository application_objectRepository
        {
            get
            {
                if (_application_objectRepository == null)
                {
                    _application_objectRepository = new application_objectRepository(_dbConnection, _userRepository);
                    _application_objectRepository.SetTransaction(_dbTransaction);
                }
                return _application_objectRepository;
            }
        }
        
        public IApplicationRoadGroupsRepository ApplicationRoadGroupsRepository
        {
            get
            {
                if (_applicationRoadGroups == null)
                {
                    _applicationRoadGroups = new ApplicationRoadGroupsRepository(_dbConnection);
                    _applicationRoadGroups.SetTransaction(_dbTransaction);
                }
                return _applicationRoadGroups;
            }
        }

        public IFeedbackRepository FeedbackRepository
        {
            get
            {
                if (_feedbackRepository == null)
                {
                    _feedbackRepository = new FeedbackRepository(_dbConnection, _userRepository);
                    _feedbackRepository.SetTransaction(_dbTransaction);
                }
                return _feedbackRepository;
            }
        }
        
        public IFeedbackFilesRepository FeedbackFilesRepository
        {
            get
            {
                if (_feedbackFilesRepository == null)
                {
                    _feedbackFilesRepository = new FeedbackFilesRepository(_dbConnection, _userRepository);
                    _feedbackFilesRepository.SetTransaction(_dbTransaction);
                }
                return _feedbackFilesRepository;
            }
        }


        public IreestrRepository reestrRepository
        {
            get
            {
                if (_reestrRepository == null)
                {
                    _reestrRepository = new reestrRepository(_dbConnection);
                    _reestrRepository.SetTransaction(_dbTransaction);
                }
                return _reestrRepository;
            }
        }
        public Iapplication_in_reestrRepository application_in_reestrRepository
        {
            get
            {
                if (_application_in_reestrRepository == null)
                {
                    _application_in_reestrRepository = new application_in_reestrRepository(_dbConnection);
                    _application_in_reestrRepository.SetTransaction(_dbTransaction);
                }
                return _application_in_reestrRepository;
            }
        }
        public Ireestr_statusRepository reestr_statusRepository
        {
            get
            {
                if (_reestr_statusRepository == null)
                {
                    _reestr_statusRepository = new reestr_statusRepository(_dbConnection);
                    _reestr_statusRepository.SetTransaction(_dbTransaction);
                }
                return _reestr_statusRepository;
            }
        }
        
        public ICustomerDiscountRepository CustomerDiscountRepository
        {
            get
            {
                if (_customerDiscountRepository == null)
                {
                    _customerDiscountRepository = new CustomerDiscountRepository(_dbConnection, _userRepository);
                    _customerDiscountRepository.SetTransaction(_dbTransaction);
                }
                return _customerDiscountRepository;
            }
        }
        
        public ICustomerDiscountDocumentsRepository CustomerDiscountDocumentsRepository
        {
            get
            {
                if (_customerDiscountDocumentsRepository == null)
                {
                    _customerDiscountDocumentsRepository = new CustomerDiscountDocumentsRepository(_dbConnection, _userRepository);
                    _customerDiscountDocumentsRepository.SetTransaction(_dbTransaction);
                }
                return _customerDiscountDocumentsRepository;
            }
        }
        
        public IDiscountDocumentTypeRepository DiscountDocumentTypeRepository
        {
            get
            {
                if (_discountDocumentTypeRepository == null)
                {
                    _discountDocumentTypeRepository = new DiscountDocumentTypeRepository(_dbConnection, _userRepository);
                    _discountDocumentTypeRepository.SetTransaction(_dbTransaction);
                }
                return _discountDocumentTypeRepository;
            }
        }
        
        public IDiscountDocumentsRepository DiscountDocumentsRepository
        {
            get
            {
                if (_discountDocumentsRepository == null)
                {
                    _discountDocumentsRepository = new DiscountDocumentsRepository(_dbConnection, _userRepository);
                    _discountDocumentsRepository.SetTransaction(_dbTransaction);
                }
                return _discountDocumentsRepository;
            }
        }
        
        public IDiscountTypeRepository DiscountTypeRepository
        {
            get
            {
                if (_discountTypeRepository == null)
                {
                    _discountTypeRepository = new DiscountTypeRepository(_dbConnection, _userRepository);
                    _discountTypeRepository.SetTransaction(_dbTransaction);
                }
                return _discountTypeRepository;
            }
        }


        public Iobject_tagRepository object_tagRepository
        {
            get
            {
                if (_object_tagRepository == null)
                {
                    _object_tagRepository = new object_tagRepository(_dbConnection);
                    _object_tagRepository.SetTransaction(_dbTransaction);
                }
                return _object_tagRepository;
            }
        }
        public Istructure_tag_applicationRepository structure_tag_applicationRepository
        {
            get
            {
                if (_structure_tag_applicationRepository == null)
                {
                    _structure_tag_applicationRepository = new structure_tag_applicationRepository(_dbConnection, _userRepository);
                    _structure_tag_applicationRepository.SetTransaction(_dbTransaction);
                }
                return _structure_tag_applicationRepository;
            }
        }
        public Istructure_tagRepository structure_tagRepository
        {
            get
            {
                if (_structure_tagRepository == null)
                {
                    _structure_tagRepository = new structure_tagRepository(_dbConnection, _userRepository);
                    _structure_tagRepository.SetTransaction(_dbTransaction);
                }
                return _structure_tagRepository;
            }
        }
        public IApplicationFilterRepository ApplicationFilterRepository 
        {
            get
            {
                if (_applicationFilterRepository == null)
                {
                    _applicationFilterRepository = new ApplicationFilterRepository(_dbConnection);
                    _applicationFilterRepository.SetTransaction(_dbTransaction);
                }
                return _applicationFilterRepository;
            }
        }

        public IApplicationFilterTypeRepository ApplicationFilterTypeRepository 
        {
            get
            {
                if (_applicationFilterTypeRepository == null)
                {
                    _applicationFilterTypeRepository = new ApplicationFilterTypeRepository(_dbConnection);
                    _applicationFilterTypeRepository.SetTransaction(_dbTransaction);
                }
                return _applicationFilterTypeRepository;
            }
        }        
        public Iapplication_squareRepository application_squareRepository
        {
            get
            {
                if (_application_squareRepository == null)
                {
                    _application_squareRepository = new application_squareRepository(_dbConnection, _userRepository);
                    _application_squareRepository.SetTransaction(_dbTransaction);
                }
                return _application_squareRepository;
            }
        }
        
        public ISystemSettingRepository SystemSettingRepository 
        {
            get
            {
                if (_systemSettingRepository == null)
                {
                    _systemSettingRepository = new SystemSettingRepository(_dbConnection, _userRepository);
                    _systemSettingRepository.SetTransaction(_dbTransaction);
                }
                return _systemSettingRepository;
            }
        }
        public IQueryFiltersRepository QueryFiltersRepository 
        {
            get
            {
                if (_queryFiltersRepository == null)
                {
                    _queryFiltersRepository = new QueryFiltersRepository(_dbConnection, _userRepository);
                    _queryFiltersRepository.SetTransaction(_dbTransaction);
                }
                return _queryFiltersRepository;
            }
        }
        public Iarchitecture_statusRepository architecture_statusRepository
        {
            get
            {
                if (_architecture_statusRepository == null)
                {
                    _architecture_statusRepository = new architecture_statusRepository(_dbConnection);
                    _architecture_statusRepository.SetTransaction(_dbTransaction);
                }
                return _architecture_statusRepository;
            }
        }
        public Iarchive_file_tagsRepository archive_file_tagsRepository
        {
            get
            {
                if (_archive_file_tagsRepository == null)
                {
                    _archive_file_tagsRepository = new archive_file_tagsRepository(_dbConnection);
                    _archive_file_tagsRepository.SetTransaction(_dbTransaction);
                }
                return _archive_file_tagsRepository;
            }
        }
        public Iarchitecture_processRepository architecture_processRepository
        {
            get
            {
                if (_architecture_processRepository == null)
                {
                    _architecture_processRepository = new architecture_processRepository(_dbConnection, _userRepository);
                    _architecture_processRepository.SetTransaction(_dbTransaction);
                }
                return _architecture_processRepository;
            }
        }
        public Istatus_dutyplan_objectRepository status_dutyplan_objectRepository
        {
            get
            {
                if (_status_dutyplan_objectRepository == null)
                {
                    _status_dutyplan_objectRepository = new status_dutyplan_objectRepository(_dbConnection);
                    _status_dutyplan_objectRepository.SetTransaction(_dbTransaction);
                }
                return _status_dutyplan_objectRepository;
            }
        }
        public Iarchirecture_roadRepository archirecture_roadRepository
        {
            get
            {
                if (_archirecture_roadRepository == null)
                {
                    _archirecture_roadRepository = new archirecture_roadRepository(_dbConnection);
                    _archirecture_roadRepository.SetTransaction(_dbTransaction);
                }
                return _archirecture_roadRepository;
            }
        }
        public Iapplication_duty_objectRepository application_duty_objectRepository
        {
            get
            {
                if (_application_duty_objectRepository == null)
                {
                    _application_duty_objectRepository = new application_duty_objectRepository(_dbConnection, _userRepository);
                    _application_duty_objectRepository.SetTransaction(_dbTransaction);
                }
                return _application_duty_objectRepository;
            }
        }

        public Itech_decisionRepository tech_decisionRepository
        {
            get
            {
                if (_tech_decisionRepository == null)
                {
                    _tech_decisionRepository = new tech_decisionRepository(_dbConnection);
                    _tech_decisionRepository.SetTransaction(_dbTransaction);
                }
                return _tech_decisionRepository;
            }
        }

        public Iarchive_doc_tagRepository archive_doc_tagRepository
        {
            get
            {
                if (_archive_doc_tagRepository == null)
                {
                    _archive_doc_tagRepository = new archive_doc_tagRepository(_dbConnection);
                    _archive_doc_tagRepository.SetTransaction(_dbTransaction);
                }
                return _archive_doc_tagRepository;
            }
        }
        public Iarchive_folderRepository archive_folderRepository
        {
            get
            {
                if (_archive_folderRepository == null)
                {
                    _archive_folderRepository = new archive_folderRepository(_dbConnection, _userRepository);
                    _archive_folderRepository.SetTransaction(_dbTransaction);
                }
                return _archive_folderRepository;
            }
        }
        public ICountryRepository countryRepository
        {
            get
            {
                if (_countryRepository == null)
                {
                    _countryRepository = new CountryRepository(_dbConnection);
                    _countryRepository.SetTransaction(_dbTransaction);
                }
                return _countryRepository;
            }
        }
        
        public IArchiveObjectCustomerRepository ArchiveObjectCustomerRepository
        {
            get
            {
                if (_archiveObjectCustomerRepository == null)
                {
                    _archiveObjectCustomerRepository = new ArchiveObjectCustomerRepository(_dbConnection, _userRepository);
                    _archiveObjectCustomerRepository.SetTransaction(_dbTransaction);
                }
                return _archiveObjectCustomerRepository;
            }
        }
        public IStructureTemplatesRepository StructureTemplatesRepository
        {
            get
            {
                if (_structureTemplatesRepository == null)
                {
                    _structureTemplatesRepository = new StructureTemplatesRepository(_dbConnection, _userRepository);
                    _structureTemplatesRepository.SetTransaction(_dbTransaction);
                }
                return _structureTemplatesRepository;
            }
        }

        public Icustomers_for_archive_objectRepository customers_for_archive_objectRepository
        {
            get
            {
                if (_customers_for_archive_objectRepository == null)
                {
                    _customers_for_archive_objectRepository = new customers_for_archive_objectRepository(_dbConnection, _userRepository);
                    _customers_for_archive_objectRepository.SetTransaction(_dbTransaction);
                }
                return _customers_for_archive_objectRepository;
            }
        }
        public IreleaseRepository releaseRepository
        {
            get
            {
                if (_releaseRepository == null)
                {
                    _releaseRepository = new releaseRepository(_dbConnection);
                    _releaseRepository.SetTransaction(_dbTransaction);
                }
                return _releaseRepository;
            }
        }
        public Irelease_videoRepository release_videoRepository
        {
            get
            {
                if (_release_videoRepository == null)
                {
                    _release_videoRepository = new release_videoRepository(_dbConnection);
                    _release_videoRepository.SetTransaction(_dbTransaction);
                }
                return _release_videoRepository;
            }
        }
        public Irelease_seenRepository release_seenRepository
        {
            get
            {
                if (_release_seenRepository == null)
                {
                    _release_seenRepository = new release_seenRepository(_dbConnection);
                    _release_seenRepository.SetTransaction(_dbTransaction);
                }
                return _release_seenRepository;
            }
        }

        public ITechCouncilRepository TechCouncilRepository
        {
            get
            {
                if (_techCouncilRepository == null)
                {
                    _techCouncilRepository = new TechCouncilRepository(_dbConnection, _userRepository);
                    _techCouncilRepository.SetTransaction(_dbTransaction);
                }
                return _techCouncilRepository;
            }
        }

        
        public ITechCouncilParticipantsSettingsRepository TechCouncilParticipantsSettingsRepository
        {
            get
            {
                if (_techCouncilParticipantsSettingsRepository == null)
                {
                    _techCouncilParticipantsSettingsRepository = new TechCouncilParticipantsSettingsRepository(_dbConnection, _userRepository);
                    _techCouncilParticipantsSettingsRepository.SetTransaction(_dbTransaction);
                }
                return _techCouncilParticipantsSettingsRepository;
            }
        }
        
        public IDecisionTypeRepository DecisionTypeRepository
        {
            get
            {
                if (_decisionTypeRepository == null)
                {
                    _decisionTypeRepository = new DecisionTypeRepository(_dbConnection, _userRepository);
                    _decisionTypeRepository.SetTransaction(_dbTransaction);
                }
                return _decisionTypeRepository;
            }
        }
        
        public IApplicationLegalRecordRepository ApplicationLegalRecordRepository
        {
            get
            {
                if (_applicationLegalRecordRepository == null)
                {
                    _applicationLegalRecordRepository = new ApplicationLegalRecordRepository(_dbConnection, _userRepository);
                    _applicationLegalRecordRepository.SetTransaction(_dbTransaction);
                }
                return _applicationLegalRecordRepository;
            }
        }
        
        public ITechCouncilFilesRepository TechCouncilFilesRepository
        {
            get
            {
                if (_techCouncilFilesRepository == null)
                {
                    _techCouncilFilesRepository = new TechCouncilFilesRepository(_dbConnection, _userRepository);
                    _techCouncilFilesRepository.SetTransaction(_dbTransaction);
                }
                return _techCouncilFilesRepository;
            }
        }
        
        public ILegalRecordInCouncilRepository LegalRecordInCouncilRepository
        {
            get
            {
                if (_legalRecordInCouncilRepository == null)
                {
                    _legalRecordInCouncilRepository = new LegalRecordInCouncilRepository(_dbConnection, _userRepository);
                    _legalRecordInCouncilRepository.SetTransaction(_dbTransaction);
                }
                return _legalRecordInCouncilRepository;
            }
        }
        public Ilegal_act_objectRepository legal_act_objectRepository
        {
            get
            {
                if (_legal_act_objectRepository == null)
                {
                    _legal_act_objectRepository = new legal_act_objectRepository(_dbConnection);
                    _legal_act_objectRepository.SetTransaction(_dbTransaction);
                }
                return _legal_act_objectRepository;
            }
        }
        public Iapplication_legal_recordRepository application_legal_recordRepository
        {
            get
            {
                if (_application_legal_recordRepository == null)
                {
                    _application_legal_recordRepository = new application_legal_recordRepository(_dbConnection);
                    _application_legal_recordRepository.SetTransaction(_dbTransaction);
                }
                return _application_legal_recordRepository;
            }
        }
        public Ilegal_record_objectRepository legal_record_objectRepository
        {
            get
            {
                if (_legal_record_objectRepository == null)
                {
                    _legal_record_objectRepository = new legal_record_objectRepository(_dbConnection);
                    _legal_record_objectRepository.SetTransaction(_dbTransaction);
                }
                return _legal_record_objectRepository;
            }
        }

        public ILegalRecordEmployeeRepository legalRecordEmployeeRepository
        {
            get
            {
                if (_legalRecordEmployeeRepository == null)
                {
                    _legalRecordEmployeeRepository = new LegalRecordEmployeeRepository(_dbConnection);
                    _legalRecordEmployeeRepository.SetTransaction(_dbTransaction);
                }
                return _legalRecordEmployeeRepository;
            }
        }

        public ILegalActEmployeeRepository legalActEmployeeRepository
        {
            get
            {
                if (_legalActEmployeeRepository == null)
                {
                    _legalActEmployeeRepository = new LegalActEmployeeRepository(_dbConnection);
                    _legalActEmployeeRepository.SetTransaction(_dbTransaction);
                }
                return _legalActEmployeeRepository;
            }
        }

        public Ilegal_record_registryRepository legal_record_registryRepository
        {
            get
            {
                if (_legal_record_registryRepository == null)
                {
                    _legal_record_registryRepository = new legal_record_registryRepository(_dbConnection);
                    _legal_record_registryRepository.SetTransaction(_dbTransaction);
                }
                return _legal_record_registryRepository;
            }
        }
        public Ilegal_objectRepository legal_objectRepository
        {
            get
            {
                if (_legal_objectRepository == null)
                {
                    _legal_objectRepository = new legal_objectRepository(_dbConnection);
                    _legal_objectRepository.SetTransaction(_dbTransaction);
                }
                return _legal_objectRepository;
            }
        }
        public Ilegal_registry_statusRepository legal_registry_statusRepository
        {
            get
            {
                if (_legal_registry_statusRepository == null)
                {
                    _legal_registry_statusRepository = new legal_registry_statusRepository(_dbConnection);
                    _legal_registry_statusRepository.SetTransaction(_dbTransaction);
                }
                return _legal_registry_statusRepository;
            }
        }
        public Ilegal_act_registryRepository legal_act_registryRepository
        {
            get
            {
                if (_legal_act_registryRepository == null)
                {
                    _legal_act_registryRepository = new legal_act_registryRepository(_dbConnection);
                    _legal_act_registryRepository.SetTransaction(_dbTransaction);
                }
                return _legal_act_registryRepository;
            }
        }
        public Ilegal_act_registry_statusRepository legal_act_registry_statusRepository
        {
            get
            {
                if (_legal_act_registry_statusRepository == null)
                {
                    _legal_act_registry_statusRepository = new legal_act_registry_statusRepository(_dbConnection);
                    _legal_act_registry_statusRepository.SetTransaction(_dbTransaction);
                }
                return _legal_act_registry_statusRepository;
            }
        }

        

        public ITechCouncilSessionRepository TechCouncilSessionRepository
        {
            get
            {
                if (_techCouncilSessionRepository == null)
                {
                    _techCouncilSessionRepository = new TechCouncilSessionRepository(_dbConnection, _userRepository);
                    _techCouncilSessionRepository.SetTransaction(_dbTransaction);
                }
                return _techCouncilSessionRepository;
            }
        }

        public Inotification_log_statusRepository notification_log_statusRepository
        {
            get
            {
                if (_notification_log_statusRepository == null)
                {
                    _notification_log_statusRepository = new notification_log_statusRepository(_dbConnection);
                    _notification_log_statusRepository.SetTransaction(_dbTransaction);
                }
                return _notification_log_statusRepository;
            }
        }
        public ISecurityEventRepository SecurityEventRepository
        {
            get
            {
                if (_securityEventRepository == null)
                {
                    _securityEventRepository = new SecurityEventRepository(_dbConnection, _userRepository);
                    _securityEventRepository.SetTransaction(_dbTransaction);
                }
                return _securityEventRepository;
            }
        }
        public Idocument_statusRepository document_statusRepository
        {
            get
            {
                if (_document_statusRepository == null)
                {
                    _document_statusRepository = new document_statusRepository(_dbConnection, _userRepository);
                    _document_statusRepository.SetTransaction(_dbTransaction);
                }
                return _document_statusRepository;
            }
        }
        
        public IServicePriceRepository ServicePriceRepository
        {
            get
            {
                if (_servicePriceRepository == null)
                {
                    _servicePriceRepository = new ServicePriceRepository(_dbConnection, _userRepository);
                    _servicePriceRepository.SetTransaction(_dbTransaction);
                }
                return _servicePriceRepository;
            }
        }
        

        public IFileDownloadLogRepository FileDownloadLogRepository
        {
            get
            {
                if (_fileDownloadLogRepository == null)
                {
                    _fileDownloadLogRepository = new FileDownloadLogRepository(_dbConnection);
                    _fileDownloadLogRepository.SetTransaction(_dbTransaction);
                }
                return _fileDownloadLogRepository;
            }
        }
        public IDutyPlanLogRepository DutyPlanLogRepository
        {
            get
            {
                if (_dutyPlanLogRepository == null)
                {
                    _dutyPlanLogRepository = new DutyPlanLogRepository(_dbConnection, _userRepository);
                    _dutyPlanLogRepository.SetTransaction(_dbTransaction);
                }
                return _dutyPlanLogRepository;
            }
        }
        public Iservice_pathRepository service_pathRepository
        {
            get
            {
                if (_service_pathRepository == null)
                {
                    _service_pathRepository = new service_pathRepository(_dbConnection);
                    _service_pathRepository.SetTransaction(_dbTransaction);
                }
                return _service_pathRepository;
            }
        }
        public Ipath_stepRepository path_stepRepository
        {
            get
            {
                if (_path_stepRepository == null)
                {
                    _path_stepRepository = new path_stepRepository(_dbConnection);
                    _path_stepRepository.SetTransaction(_dbTransaction);
                }
                return _path_stepRepository;
            }
        }
        public Istep_dependencyRepository step_dependencyRepository
        {
            get
            {
                if (_step_dependencyRepository == null)
                {
                    _step_dependencyRepository = new step_dependencyRepository(_dbConnection);
                    _step_dependencyRepository.SetTransaction(_dbTransaction);
                }
                return _step_dependencyRepository;
            }
        }
        public Idocument_approverRepository document_approverRepository
        {
            get
            {
                if (_document_approverRepository == null)
                {
                    _document_approverRepository = new document_approverRepository(_dbConnection);
                    _document_approverRepository.SetTransaction(_dbTransaction);
                }
                return _document_approverRepository;
            }
        }
        public Istep_required_documentRepository step_required_documentRepository
        {
            get
            {
                if (_step_required_documentRepository == null)
                {
                    _step_required_documentRepository = new step_required_documentRepository(_dbConnection);
                    _step_required_documentRepository.SetTransaction(_dbTransaction);
                }
                return _step_required_documentRepository;
            }
        }
        public Istep_partnerRepository step_partnerRepository
        {
            get
            {
                if (_step_partnerRepository == null)
                {
                    _step_partnerRepository = new step_partnerRepository(_dbConnection);
                    _step_partnerRepository.SetTransaction(_dbTransaction);
                }
                return _step_partnerRepository;
            }
        }

        public Idocument_approvalRepository document_approvalRepository
        {
            get
            {
                if (_document_approvalRepository == null)
                {
                    _document_approvalRepository = new document_approvalRepository(_dbConnection);
                    _document_approvalRepository.SetTransaction(_dbTransaction);
                }
                return _document_approvalRepository;
            }
        }


        public Iapplication_stepRepository application_stepRepository
        {
            get
            {
                if (_application_stepRepository == null)
                {
                    _application_stepRepository = new application_stepRepository(_dbConnection);
                    _application_stepRepository.SetTransaction(_dbTransaction);
                }
                return _application_stepRepository;
            }
        }
        public Iapplication_pauseRepository application_pauseRepository
        {
            get
            {
                if (_application_pauseRepository == null)
                {
                    _application_pauseRepository = new application_pauseRepository(_dbConnection);
                    _application_pauseRepository.SetTransaction(_dbTransaction);
                }
                return _application_pauseRepository;
            }
        }
        public Istep_required_work_documentRepository step_required_work_documentRepository
        {
            get
            {
                if (_step_required_work_documentRepository == null)
                {
                    _step_required_work_documentRepository = new step_required_work_documentRepository(_dbConnection);
                    _step_required_work_documentRepository.SetTransaction(_dbTransaction);
                }
                return _step_required_work_documentRepository;
            }
        }
        
        public ILawDocumentTypeRepository LawDocumentTypeRepository
        {
            get
            {
                if (_lawDocumentTypeRepository == null)
                {
                    _lawDocumentTypeRepository = new LawDocumentTypeRepository(_dbConnection, _userRepository);
                    _lawDocumentTypeRepository.SetTransaction(_dbTransaction);
                }
                return _lawDocumentTypeRepository;
            }
        }
        
        public ILawDocumentRepository LawDocumentRepository
        {
            get
            {
                if (_lawDocumentRepository == null)
                {
                    _lawDocumentRepository = new LawDocumentRepository(_dbConnection, _userRepository);
                    _lawDocumentRepository.SetTransaction(_dbTransaction);
                }
                return _lawDocumentRepository;
            }
        }
        
        public IStepStatusLogRepository StepStatusLogRepository
        {
            get
            {
                if (_stepStatusLogRepository == null)
                {
                    _stepStatusLogRepository = new StepStatusLogRepository(_dbConnection, _userRepository);
                    _stepStatusLogRepository.SetTransaction(_dbTransaction);
                }
                return _stepStatusLogRepository;
            }
        }


        public IApplicationRequiredCalcRepository ApplicationRequiredCalcRepository
        {
            get
            {
                if (_applicationRequiredCalcRepository == null)
                {
                    _applicationRequiredCalcRepository = new ApplicationRequiredCalcRepository(_dbConnection, _userRepository);
                    _applicationRequiredCalcRepository.SetTransaction(_dbTransaction);
                }
                return _applicationRequiredCalcRepository;
            }
        }
        
        public IStepRequiredCalcRepository StepRequiredCalcRepository
        {
            get
            {
                if (_stepRequiredCalcRepository == null)
                {
                    _stepRequiredCalcRepository = new StepRequiredCalcRepository(_dbConnection, _userRepository);
                    _stepRequiredCalcRepository.SetTransaction(_dbTransaction);
                }
                return _stepRequiredCalcRepository;
            }
        }
        
        public IApplicationInReestrCalcRepository ApplicationInReestrCalcRepository
        {
            get
            {
                if (_applicationInReestrCalcRepository == null)
                {
                    _applicationInReestrCalcRepository = new ApplicationInReestrCalcRepository(_dbConnection, _userRepository);
                    _applicationInReestrCalcRepository.SetTransaction(_dbTransaction);
                }
                return _applicationInReestrCalcRepository;
            }
        }
        
        public IApplicationInReestrPayedRepository ApplicationInReestrPayedRepository
        {
            get
            {
                if (_applicationInReestrPayedRepository == null)
                {
                    _applicationInReestrPayedRepository = new ApplicationInReestrPayedRepository(_dbConnection, _userRepository);
                    _applicationInReestrPayedRepository.SetTransaction(_dbTransaction);
                }
                return _applicationInReestrPayedRepository;
            }
        }
        
        public IApplicationOutgoingDocumentRepository ApplicationOutgoingDocumentRepository
        {
            get
            {
                if (_applicationOutgoingDocumentRepository == null)
                {
                    _applicationOutgoingDocumentRepository = new ApplicationOutgoingDocumentRepository(_dbConnection, _userRepository);
                    _applicationOutgoingDocumentRepository.SetTransaction(_dbTransaction);
                }
                return _applicationOutgoingDocumentRepository;
            }
        }
        
        public IDocumentJournalsRepository DocumentJournalsRepository
        {
            get
            {
                if (_documentJournalsRepository == null)
                {
                    _documentJournalsRepository = new DocumentJournalsRepository(_dbConnection, _userRepository);
                    _documentJournalsRepository.SetTransaction(_dbTransaction);
                }
                return _documentJournalsRepository;
            }
        }
        
        public IServiceStatusNumberingRepository ServiceStatusNumberingRepository
        {
            get
            {
                if (_serviceStatusNumberingRepository == null)
                {
                    _serviceStatusNumberingRepository = new ServiceStatusNumberingRepository(_dbConnection, _userRepository);
                    _serviceStatusNumberingRepository.SetTransaction(_dbTransaction);
                }
                return _serviceStatusNumberingRepository;
            }
        }
        
        public IJournalPlaceholderRepository JournalPlaceholderRepository
        {
            get
            {
                if (_journalPlaceholderRepository == null)
                {
                    _journalPlaceholderRepository = new JournalPlaceholderRepository(_dbConnection, _userRepository);
                    _journalPlaceholderRepository.SetTransaction(_dbTransaction);
                }
                return _journalPlaceholderRepository;
            }
        }
        
        public IJournalTemplateTypeRepository JournalTemplateTypeRepository
        {
            get
            {
                if (_journalTemplateTypeRepository == null)
                {
                    _journalTemplateTypeRepository = new JournalTemplateTypeRepository(_dbConnection, _userRepository);
                    _journalTemplateTypeRepository.SetTransaction(_dbTransaction);
                }
                return _journalTemplateTypeRepository;
            }
        }

        public IJournalApplicationRepository JournalApplicationRepository
        {
            get
            {
                if (_journalApplicationRepository == null)
                {
                    _journalApplicationRepository = new JournalApplicationRepository(_dbConnection, _userRepository);
                    _journalApplicationRepository.SetTransaction(_dbTransaction);
                }
                return _journalApplicationRepository;
            }
        }

        public IAddressUnitTypeRepository AddressUnitTypeRepository
        {
            get
            {
                if (_addressUnitTypeRepository == null)
                {
                    _addressUnitTypeRepository = new AddressUnitTypeRepository(_dbConnection, _userRepository);
                    _addressUnitTypeRepository.SetTransaction(_dbTransaction);
                }
                return _addressUnitTypeRepository;
            }
        }
        public IAddressUnitRepository AddressUnitRepository
        {
            get
            {
                if (_addressUnitRepository == null)
                {
                    _addressUnitRepository = new AddressUnitRepository(_dbConnection, _userRepository);
                    _addressUnitRepository.SetTransaction(_dbTransaction);
                }
                return _addressUnitRepository;
            }
        }

        public IStreetTypeRepository StreetTypeRepository
        {
            get
            {
                if (_streetTypeRepository == null)
                {
                    _streetTypeRepository = new StreetTypeRepository(_dbConnection, _userRepository);
                    _streetTypeRepository.SetTransaction(_dbTransaction);
                }
                return _streetTypeRepository;
            }
        }
        public IStreetRepository StreetRepository
        {
            get
            {
                if (_streetRepository == null)
                {
                    _streetRepository = new StreetRepository(_dbConnection, _userRepository);
                    _streetRepository.SetTransaction(_dbTransaction);
                }
                return _streetRepository;
            }
        }

        public IEventTypeRepository EventTypeRepository
        {
            get
            {
                if (_eventTypeRepository == null)
                {
                    _eventTypeRepository = new EventTypeRepository(_dbConnection, _userRepository);
                    _eventTypeRepository.SetTransaction(_dbTransaction);
                }
                return _eventTypeRepository;
            }
        }


        public IArchiveObjectsEventsRepository ArchiveObjectsEventsrepository
        {
            get
            {
                if (_archiveObjectsEventsRepository == null)
                {
                    _archiveObjectsEventsRepository = new ArchiveObjectsEventsRepository(_dbConnection, _userRepository);
                    _archiveObjectsEventsRepository.SetTransaction(_dbTransaction);
                }
                return _archiveObjectsEventsRepository;
            }
        }

        public IEmployeeSavedFiltersRepository EmployeeSavedFiltersRepository
        {
            get
            {
                if (_employeeSavedFiltersRepository == null)
                {
                    _employeeSavedFiltersRepository = new EmployeeSavedFiltersRepository(_dbConnection, _userRepository);
                    _employeeSavedFiltersRepository.SetTransaction(_dbTransaction);
                }
                return _employeeSavedFiltersRepository;
            }
        }

        public ISmejPortalApiRepository SmejPortalApiRepository
        {
            get
            {
                if (_smejPortalApiRepository == null)
                {
                    _smejPortalApiRepository = new SmejPortalApiRepository(_configuration);
                }
                return _smejPortalApiRepository;
            }
        }


        public void Commit()
        {
            try
            {
                _dbTransaction.Commit();
            }
            catch(Exception e)
            {
                _logger.LogError(e, "commit: " + e.Message);
                _dbTransaction.Rollback();
                throw;
            }
            finally
            {
                _dbTransaction.Dispose();
                _dbTransaction = _dbConnection.BeginTransaction();
            }
        }

        public void Rollback()
        {
            _dbTransaction.Rollback();
            _dbTransaction.Dispose();
            _dbTransaction = _dbConnection.BeginTransaction();
        }

        public void Dispose()
        {
            _dbTransaction?.Dispose();
            _dbConnection?.Dispose();
        }
    }
}
