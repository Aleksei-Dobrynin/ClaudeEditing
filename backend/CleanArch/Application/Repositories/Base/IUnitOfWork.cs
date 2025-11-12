using Application.Repositories;

namespace Application.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        ISmProjectRepository SmProjectRepository { get; }
        Idocument_statusRepository document_statusRepository { get; }
        IWorkScheduleRepository WorkScheduleRepository { get; }
        ISmProjectTypeRepository SmProjectTypeRepository { get; }
        ISmProjectTagsRepository SmProjectTagsRepository { get; }
        ICustomSvgIconRepository CustomSvgIconRepository { get; }
        ISurveyTagsRepository SurveyTagsRepository { get; }
        IApplicationDocumentTypeRepository ApplicationDocumentTypeRepository { get; }
        IWorkDocumentTypeRepository WorkDocumentTypeRepository { get; }
        IApplicationDocumentRepository ApplicationDocumentRepository { get; }
        IFileTypeForApplicationDocumentRepository FileTypeForApplicationDocumentRepository { get; }
        IFileForApplicationDocumentRepository FileForApplicationDocumentRepository { get; }
        IServiceDocumentRepository ServiceDocumentRepository { get; }
        IServiceRepository ServiceRepository { get; }
        IFileRepository FileRepository { get; }
        IEmployeeRepository EmployeeRepository { get; }
        Iemployee_contactRepository employee_contactRepository { get; }
        IEmployeeInStructureRepository EmployeeInStructureRepository { get; }
        IRoleRepository RoleRepository { get; }
        IUserRoleRepository UserRoleRepository { get; }
        IStructurePostRepository StructurePostRepository { get; }
        IcontragentRepository contragentRepository { get; }
        IApplicationStatusRepository ApplicationStatusRepository { get; }
        IApplicationStatusHistoryRepository ApplicationStatusHistoryRepository { get; }
        IApplicationRepository ApplicationRepository { get; }
        IMariaDbRepository MariaDbRepository { get; }
        ICustomerRepository CustomerRepository { get; }
        IUploadedApplicationDocumentRepository UploadedApplicationDocumentRepository { get; }

        IWorkScheduleExceptionRepository WorkScheduleExceptionRepository { get; }
        IWorkDayRepository WorkDayRepository { get; }
        IOrgStructureRepository OrgStructureRepository { get; }
        IS_PlaceHolderTemplateRepository S_PlaceHolderTemplateRepository { get; }
        IS_DocumentTemplateTranslationRepository S_DocumentTemplateTranslationRepository { get; }
        IS_DocumentTemplateRepository S_DocumentTemplateRepository { get; }
        IS_TemplateDocumentPlaceholderRepository S_TemplateDocumentPlaceholderRepository { get; }
        IS_DocumentTemplateTypeRepository S_DocumentTemplateTypeRepository { get; }
        ILanguageRepository LanguageRepository { get; }
        IS_QueriesDocumentTemplateRepository S_QueriesDocumentTemplateRepository { get; }
        IS_PlaceHolderTypeRepository S_PlaceHolderTypeRepository { get; }
        IS_QueryRepository S_QueryRepository { get; }
        IArchObjectRepository ArchObjectRepository { get; }
        IDistrictRepository DistrictRepository { get; }
        Iuploaded_application_documentRepository uploaded_application_documentRepository { get; }
        ICustomerRepresentativeRepository CustomerRepresentativeRepository { get; }
        IWorkflowRepository WorkflowRepository { get; }
        IWorkflowTaskTemplateRepository WorkflowTaskTemplateRepository { get; }
        IWorkflowSubtaskTemplateRepository WorkflowSubtaskTemplateRepository { get; }
        IWorkflowTaskDependencyRepository WorkflowTaskDependencyRepository { get; }

        Iapplication_paymentRepository application_paymentRepository { get; }
        Itask_statusRepository task_statusRepository { get; }
        Iapplication_subtaskRepository application_subtaskRepository { get; }
        Iapplication_task_assigneeRepository application_task_assigneeRepository { get; }
        Iapplication_taskRepository application_taskRepository { get; }
        Icontact_typeRepository contact_typeRepository { get; }
        Icustomer_contactRepository customer_contactRepository { get; }
        Iorganization_typeRepository organization_typeRepository { get; }
        InotificationRepository notificationRepository { get; }
        IHistoryTableRepository HistoryTableRepository { get; }
        Iarch_object_tagRepository arch_object_tagRepository { get; }
        ITagRepository TagRepository { get; }
        IStructureReportRepository StructureReportRepository { get; }
        IStructureReportConfigRepository StructureReportConfigRepository { get; }
        IStructureReportFieldRepository StructureReportFieldRepository { get; }
        IStructureReportFieldConfigRepository StructureReportFieldConfigRepository { get; }
        IStructureReportStatusRepository StructureReportStatusRepository { get; }
        IUnitForFieldConfigRepository UnitForFieldConfigRepository { get; }
        IUnitTypeRepository UnitTypeRepository { get; }

        Isaved_application_documentRepository saved_application_documentRepository { get; }
        IApplicationPaidInvoiceRepository ApplicationPaidInvoiceRepository { get; }
        Icontragent_interaction_docRepository contragent_interaction_docRepository { get; }
        Icontragent_interactionRepository contragent_interactionRepository { get; }

        Iapplication_subtask_assigneeRepository application_subtask_assigneeRepository { get; }
        Itask_typeRepository task_typeRepository { get; }
        IApplicationWorkDocumentRepository ApplicationWorkDocumentRepository { get; }


        Iapplication_commentRepository application_commentRepository { get; }
        IEmployeeEventRepository EmployeeEventRepository { get; }
        IHrmsEventTypeRepository HrmsEventTypeRepository { get; }
        Ifaq_questionRepository faq_questionRepository { get; }
        //IAuthRepository authRepository { get; }
        IApplicationRoadRepository ApplicationRoadRepository { get; }
        IUserRepository UserRepository { get; }
        IUserLoginHistoryRepository UserLoginHistoryRepository { get; }

        ICustomSubscribtionRepository CustomSubscribtionRepository { get; }
        IScheduleTypeRepository ScheduleTypeRepository { get; }
        Iorg_structure_templatesRepository org_structure_templatesRepository { get; }
        Itelegram_questionsRepository telegram_questionsRepository { get; }
        Itelegram_subjectsRepository telegram_subjectsRepository { get; }
        Itelegram_questions_fileRepository telegram_questions_fileRepository { get; }
        Itelegram_questions_chatsRepository  telegram_questions_chatsRepository {get;}
        Inotification_templateRepository notification_templateRepository { get; }
        Inotification_logRepository notification_logRepository { get; }
        IArchiveLogStatusRepository ArchiveLogStatusRepository { get; }
        IArchiveLogRepository ArchiveLogRepository { get; }
        Istructure_application_logRepository structure_application_logRepository { get; }
        Iidentity_document_typeRepository identity_document_typeRepository { get; }
        void Commit();
        IRepeatTypeRepository RepeatTypeRepository { get; }        
        IArchiveObjectRepository ArchiveObjectRepository { get; }        
        IArchiveObjectCustomerRepository ArchiveObjectCustomerRepository { get; }
        IArchiveObjectFileRepository ArchiveObjectFileRepository { get; }
        Iapplication_objectRepository application_objectRepository { get; }
        IFeedbackRepository FeedbackRepository { get; }
        IFeedbackFilesRepository FeedbackFilesRepository { get; }
        IMapRepository MapRepository { get; }
        IreestrRepository reestrRepository { get; }
        Iapplication_in_reestrRepository application_in_reestrRepository { get; }
        Ireestr_statusRepository reestr_statusRepository { get; }
        Iobject_tagRepository object_tagRepository { get; }
        Istructure_tag_applicationRepository structure_tag_applicationRepository { get; }
        Istructure_tagRepository structure_tagRepository { get; }
        IApplicationFilterRepository ApplicationFilterRepository { get; }
        IApplicationFilterTypeRepository ApplicationFilterTypeRepository { get; }
        IApplicationRoadGroupsRepository ApplicationRoadGroupsRepository { get; }
        void Rollback();
        Iuser_selectable_questions_telegramRepository user_selectable_questions_telegramRepository { get; }
        ICustomerDiscountRepository CustomerDiscountRepository { get; }
        ICustomerDiscountDocumentsRepository CustomerDiscountDocumentsRepository { get; }
        IDiscountDocumentTypeRepository DiscountDocumentTypeRepository { get; }
        IDiscountDocumentsRepository DiscountDocumentsRepository { get; }
        IDiscountTypeRepository DiscountTypeRepository { get; }
        ISystemSettingRepository SystemSettingRepository { get; }
        Iapplication_squareRepository application_squareRepository { get; }
        IQueryFiltersRepository QueryFiltersRepository { get; }

        Iarchitecture_statusRepository architecture_statusRepository { get; }
        Iarchive_file_tagsRepository archive_file_tagsRepository { get; }
        Iarchitecture_processRepository architecture_processRepository { get; }
        Istatus_dutyplan_objectRepository status_dutyplan_objectRepository { get; }
        Iarchirecture_roadRepository archirecture_roadRepository { get; }
        Iapplication_duty_objectRepository application_duty_objectRepository { get; }
        Iarchive_doc_tagRepository archive_doc_tagRepository { get; }
        Iarchive_folderRepository archive_folderRepository { get; }
        ICountryRepository countryRepository { get; }

        Itech_decisionRepository tech_decisionRepository { get; }
        Icustomers_for_archive_objectRepository customers_for_archive_objectRepository { get; }
        IStructureTemplatesRepository StructureTemplatesRepository { get; }
        ITechCouncilRepository TechCouncilRepository { get; }
        ITechCouncilParticipantsSettingsRepository TechCouncilParticipantsSettingsRepository { get; }
        IDecisionTypeRepository DecisionTypeRepository { get; }
        IApplicationLegalRecordRepository ApplicationLegalRecordRepository { get; }
        ITechCouncilFilesRepository TechCouncilFilesRepository { get; }
        ILegalRecordInCouncilRepository LegalRecordInCouncilRepository { get; }
        Ilegal_act_objectRepository legal_act_objectRepository { get; }
        Iapplication_legal_recordRepository application_legal_recordRepository { get; }
        Ilegal_record_objectRepository legal_record_objectRepository { get; }
        Ilegal_record_registryRepository legal_record_registryRepository { get; }
        Ilegal_objectRepository legal_objectRepository { get; }
        Ilegal_registry_statusRepository legal_registry_statusRepository { get; }
        Ilegal_act_registryRepository legal_act_registryRepository { get; }
        Ilegal_act_registry_statusRepository legal_act_registry_statusRepository { get; }
        IreleaseRepository releaseRepository { get; }
        Irelease_videoRepository release_videoRepository { get; }
        Irelease_seenRepository release_seenRepository { get; }
        ILegalActEmployeeRepository legalActEmployeeRepository { get; }
        ILegalRecordEmployeeRepository legalRecordEmployeeRepository { get; }
        ITechCouncilSessionRepository TechCouncilSessionRepository { get; }
        Inotification_log_statusRepository notification_log_statusRepository { get; }
        ISecurityEventRepository SecurityEventRepository { get; }
        IServicePriceRepository ServicePriceRepository { get; }

        Iservice_pathRepository service_pathRepository { get; }
        Ipath_stepRepository path_stepRepository { get; }
        IFileDownloadLogRepository FileDownloadLogRepository { get; }
        IDutyPlanLogRepository DutyPlanLogRepository { get; }
        Istep_dependencyRepository step_dependencyRepository { get; }
        Idocument_approverRepository document_approverRepository { get; }
        Idocument_approvalRepository document_approvalRepository { get; }
        Istep_required_documentRepository step_required_documentRepository { get; }
        Istep_partnerRepository step_partnerRepository { get; }
        Iapplication_stepRepository application_stepRepository { get; }
        Iapplication_pauseRepository application_pauseRepository { get; }
        Istep_required_work_documentRepository step_required_work_documentRepository { get; }
        ILawDocumentTypeRepository LawDocumentTypeRepository { get; }
        ILawDocumentRepository LawDocumentRepository { get; }
        IStepStatusLogRepository StepStatusLogRepository { get; }
        IApplicationRequiredCalcRepository ApplicationRequiredCalcRepository { get; }
        IStepRequiredCalcRepository StepRequiredCalcRepository { get; }
        IApplicationInReestrCalcRepository ApplicationInReestrCalcRepository { get; }
        IApplicationInReestrPayedRepository ApplicationInReestrPayedRepository { get; }
        IApplicationOutgoingDocumentRepository ApplicationOutgoingDocumentRepository { get; }
        IDocumentJournalsRepository DocumentJournalsRepository { get; }
        IServiceStatusNumberingRepository ServiceStatusNumberingRepository { get; }
        IJournalPlaceholderRepository JournalPlaceholderRepository { get; }
        IJournalTemplateTypeRepository JournalTemplateTypeRepository { get; }
        IJournalApplicationRepository JournalApplicationRepository { get; }

        IAddressUnitRepository AddressUnitRepository { get; }
        IAddressUnitTypeRepository AddressUnitTypeRepository { get; }
        IStreetTypeRepository StreetTypeRepository { get; }
        IStreetRepository StreetRepository { get; }
        IArchiveObjectsEventsRepository ArchiveObjectsEventsrepository { get; }
        IEventTypeRepository EventTypeRepository { get; }
        IEmployeeSavedFiltersRepository EmployeeSavedFiltersRepository { get; }
        ISmejPortalApiRepository SmejPortalApiRepository { get; }
        IRegistratorServiceConfigRepository RegistratorServiceConfigRepository { get; }
        }
}
