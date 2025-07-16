import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import NavigationScroll from "layouts/NavigationScroll";
import AttributeTypeAddEditView from "features/AttributeType/AttributeTypeAddEditView";
import AttributeTypeListView from "features/AttributeType/AttributeTypeListView";
import Notification_templateAddEditView from "features/notification_template/notification_templateAddEditView";
import Notification_templateListView from "features/notification_template/notification_templateListView";
import SmProjectAddEditView from "features/SmProject/SmProjectAddEditView";
import SmProjectListView from "features/SmProject/SmProjectListView";
import MainWrapper from "layouts/MainWrapper";
import CommunicationView from "features/Communication";

import S_PlaceHolderTypeAddEditView from "features/S_PlaceHolderType/S_PlaceHolderTypeAddEditView";
import S_PlaceHolderTypeListView from "features/S_PlaceHolderType/S_PlaceHolderTypeListView";
import S_TemplateDocumentPlaceholderAddEditView
  from "features/S_TemplateDocumentPlaceholder/S_TemplateDocumentPlaceholderAddEditView";
import S_TemplateDocumentPlaceholderListView
  from "features/S_TemplateDocumentPlaceholder/S_TemplateDocumentPlaceholderListView";
import S_QueryAddEditView from "features/S_Query/S_QueryAddEditView";
import S_QueryListView from "features/S_Query/S_QueryListView";
import CustomSvgIconAddEditView from "features/CustomSvgIcon/CustomSvgIconAddEditView";
import CustomSvgIconListView from "features/CustomSvgIcon/CustomSvgIconListView";
import S_QueriesDocumentTemplateAddEditView
  from "features/S_QueriesDocumentTemplate/S_QueriesDocumentTemplateAddEditView";
import S_QueriesDocumentTemplateListView from "features/S_QueriesDocumentTemplate/S_QueriesDocumentTemplateListView";
import S_DocumentTemplateAddEditView from "features/S_DocumentTemplate/S_DocumentTemplateAddEditView";
import S_DocumentTemplateListView from "features/S_DocumentTemplate/S_DocumentTemplateListView";
import LanguageAddEditView from "features/Language/LanguageAddEditView";
import LanguageListView from "features/Language/LanguageListView";
import S_DocumentTemplateTypeAddEditView from "features/S_DocumentTemplateType/S_DocumentTemplateTypeAddEditView";
import S_DocumentTemplateTypeListView from "features/S_DocumentTemplateType/S_DocumentTemplateTypeListView";
import Work_scheduleAddEditView from "features/work_schedule/work_scheduleAddEditView";
import Work_scheduleListView from "features/work_schedule/work_scheduleListView";
import Org_structureAddEditView from "features/org_structure/org_structureAddEditView";
import Org_structureListView from "features/org_structure/org_structureListView";
import SignIn from "features/Auth/SingIn";
import ForgotPassword from "features/Auth/forgotPassword";
import ApplicationDocumentTypeListView from "./features/ApplicationDocumentType/ApplicationDocumentTypeListView";
import ApplicationDocumentListView from "./features/ApplicationDocument/ApplicationDocumentListView";
import ApplicationDocumentAddEditView from "./features/ApplicationDocument/ApplicationDocumentAddEditView";
import FileTypeForApplicationDocumentListView
  from "./features/FileTypeForApplicationDocument/FileTypeForApplicationDocumentListView";
import ServiceListView from "./features/Service/ServiceListView";
import ServiceAddEditView from "./features/Service/ServiceAddEditView";
import EmployeeListView from "./features/Employee/EmployeeListView";
import EmployeeAddEditView from "./features/Employee/EmployeeAddEditView";
import StructurePostListView from "./features/StructurePost/StructurePostListView";
import AccountSettings from "./features/AccountSettings";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import AuthLogin from "./features/Login";
import CustomerListView from "./features/Customer/CustomerListView";
import CustomerAddEditView from "./features/Customer/CustomerAddEditView";
import ApplicationListView from "./features/Application/ApplicationListView";
import ApplicationFromCabinetListView from "./features/Application/ApplicationsFromCabinet";
import ApplicationAddEditView from "./features/Application/ApplicationAddEditView";
import ApplicationStatusHistoryListView from "./features/HistoryTable/StatusHistoryTableListView"

import ApplicationPaymentListView from "./features/ApplicationPayment/application_paymentListView"
import ApplicationPaymentAddEditView from "./features/ApplicationPayment/application_paymentAddEditView";

import ArchObjectListView from "./features/ArchObject/ArchObjectListView";
import ArchObjectAddEditView from "./features/ArchObject/ArchObjectAddEditView";
import DistrictListView from "./features/District/DistrictListView";
import DistrictAddEditView from "./features/District/DistrictAddEditView";
import CustomerRepresentativeListView from "./features/CustomerRepresentative/CustomerRepresentativeListView";
import WorkflowListView from "./features/Workflow/WorkflowListView";
import WorkflowAddEditView from "./features/Workflow/WorkflowAddEditView";
import Contact_typeAddEditView from "features/contact_type/contact_typeAddEditView";
import Contact_typeListView from "features/contact_type/contact_typeListView";
import Organization_typeAddEditView from "features/organization_type/organization_typeAddEditView";
import Organization_typeListView from "features/organization_type/organization_typeListView";
import ApplicationTaskAddEditView from "features/application_task/application_taskAddEditView";
import ApplicationSubTaskAddEditView from "features/application_subtask/application_subtaskAddEditView";
import Task_typeListView from "features/task_type/task_typeListView";
import Task_typeAddEditView from "features/task_type/task_typeAddEditView";
import Task_statusListView from "features/task_status/task_statusListView";
import Task_statusAddEditView from "features/task_status/task_statusAddEditView";
import Faq_questionView from 'features/faq_question/faq_questionListView';
import Faq_questionAddEditView from 'features/faq_question/faq_questionAddEditView';
import Faq_questionAccordions from 'features/faq_question/faq_questionListView/accordion';

import NotificationAddEditView from "features/notification/notificationAddEditView";
import NotificationListView from "features/notification/notificationListView";
import NotificationLogListView from "features/notificationLog/notificationLogListView";
import ApplicationNotificationLogListView from "features/notificationLog/applicationNotificationLogListView";

import ApplicationReportListView from "features/ApplicationReport/ApplicationReportListView";
import ApplicationCommentsListView from "features/ApplicationComments/ApplicationCommentsListView";
import ApplicationPaidInvoiceTaxListView from "features/ApplicationPaidInvoiceTax/ApplicationPaidInvoiceTaxListView";

import Contragent_interactionListView from "features/contragent_interaction/contragent_interaction2ListView";
import Contragent_interactionAddEditView from "features/contragent_interaction/contragent_interaction2AddEditView";
import ApplicationRoadListView from "features/ApplicationRoad/ApplicationRoadListView";
import ArchitectureListView from "features/archirecture_road/archirecture_roadListView";

import themes from "themes";
import MainLayout from "layouts/MainLayout";
import TagListView from "features/Tag/TagListView";
import TagAddEditView from "features/Tag/TagAddEditView";
import MyTasks from "features/application_task/my_tasks";
import MyApps from "features/application_task/my_apps";
import TaskCard from "features/application_task/task";
import HrmsEventTypeListView from "features/HrmsEventType/HrmsEventTypeListView";
import DashboardView from "features/Dashboard";
import DashboardHead from "features/DashboardHead";
import DashboardEmployeeView from "features/DashboardEmployee";
import DashboarHeadDepartmentdView from "features/Dashboard_headDepartment";

import CustomSubscribtionListView from "./features/CustomSubscribtion/CustomSubscribtionListView";
import CustomSubscribtionAddEditView from "./features/CustomSubscribtion/CustomSubscribtionAddEditView";
import TelegramAdminListVew from "./features/TelegramAdmin/TelegramAdminListView";
import BaseTelegramAdminView from "./features/TelegramAdmin/TelegramAdminAddEditView/base";
import TelegramAdminAddEditView from "./features/TelegramAdmin/TelegramAdminAddEditView";
import ArchiveObjectListVew from "./features/ArchiveObject/ArchiveObjectListView";
import ArchiveObjectAddEditView from "./features/ArchiveObject/ArchiveObjectAddEditView";
import ArchitectureProcess from "./features/ArchiveObject/ArchiveObjectsFromApplication";
import ArchiveObjectFromAppEdit from "./features/ArchiveObject/ArchiveObjectFromAppEdit";
import Structure_application_logAddEditView from 'features/structure_application_log/structure_application_logAddEditView';
import Structure_application_logListView from 'features/structure_application_log/structure_application_logListView';
import ArchiveLogStatusListVew from "./features/ArchiveLogStatus/ArchiveLogStatusListView";
import ArchiveLogStatusAddEditView from "./features/ArchiveLogStatus/ArchiveLogStatusAddEditView";
import ArchiveLogListVew from "./features/ArchiveLog/ArchiveLogListView";
import ArchiveLogAddEditView from "./features/ArchiveLog/ArchiveLogAddEditView";
import MyEmployeesListView from "./features/MyEmployees/MyEmployeesListView";
import AllTasks from "features/application_task/all_tasks";
import ReestrAddEditView from 'features/reestr/reestrAddEditView';
import ReestrListView from 'features/reestr/reestrListView';
import ReestrOtchetView from 'features/reestr/otchet';
import ReestrRealizationView from 'features/reestr/realization';
import ReestrTaxView from 'features/reestr/tax';
import ReestrSvodnayaView from 'features/application_in_reestr/svodnaya';

import CustomerDiscountAddEditView from 'features/CustomerDiscount/CustomerDiscountAddEditView';
import CustomerDiscountListView from 'features/CustomerDiscount/CustomerDiscountListView';
import DiscountDocumentsAddEditView from 'features/DiscountDocuments/DiscountDocumentsAddEditView';
import DiscountDocumentsListView from 'features/DiscountDocuments/DiscountDocumentsListView';
import DiscountTypeAddEditView from 'features/DiscountType/DiscountTypeAddEditView';
import DiscountTypeListView from 'features/DiscountType/DiscountTypeListView';
import DiscountDocumentTypeAddEditView from 'features/DiscountDocumentType/DiscountDocumentTypeAddEditView';
import DiscountDocumentTypeListView from 'features/DiscountDocumentType/DiscountDocumentTypeListView';
import ReportView from "features/Report";
import ReportConfig from "features/ReportConfig";
import StructureReportConfigView from "features/StructureReportConfig";


import AppFilterView from 'features/ApplicationFilter/AppFilterView';
import ApplicationFilterListView from 'features/ApplicationFilter/ApplicationFilterListView';
import ApplicationFilterAddEditView from 'features/ApplicationFilter/ApplicationFilterAddEditView';
import ApplicationFilterTypeListView from 'features/ApplicationFilterType/ApplicationFilterTypeListView';
import ApplicationFilterTypeAddEditView from 'features/ApplicationFilterType/ApplicationFilterTypeAddEditView';

import Structure_reportListView from "features/structure_report/structure_reportListView";
import Structure_reportAddEditView from "features/structure_report/structure_reportAddEditView";
import Structure_report_configtListView from "features/structure_report_config/structure_report_configListView";
import Structure_report_configAddEditView from "features/structure_report_config/structure_report_configAddEditView";
import Structure_report_fieldListView from "features/structure_report_field/structure_report_fieldListView";
import Structure_report_fieldAddEditView from "features/structure_report_field/structure_report_fieldAddEditView";
import Structure_report_field_configListView from "features/structure_report_field_config/structure_report_field_configListView";
import Structure_report_field_configAddEditView from "features/structure_report_field_config/structure_report_field_configAddEditView";
import Structure_report_statusListView from "features/structure_report_status/structure_report_statusListView";
import Structure_report_statusAddEditView from "features/structure_report_status/structure_report_statusAddEditView";
import Unit_for_field_configListView from "features/unit_for_field_config/unit_for_field_configListView";
import Unit_for_field_configAddEditView from "features/unit_for_field_config/unit_for_field_configAddEditView";
import Unit_typeListView from "features/unit_type/unit_typeListView";
import Unit_typeAddEditView from "features/unit_type/unit_typeAddEditView";
import QueryFiltersListView from "features/QueryFilters/QueryFiltersListView";
import QueryFiltersEditView from "features/QueryFilters/QueryFiltersAddEditView";
import Archive_folderListView from "features/archive_folder/archive_folderListView";
import Archive_folderAddEditView from "features/archive_folder/archive_folderAddEditView";
import Architecture_statusListView from "features/architecture_status/architecture_statusListView";
import Architecture_statusAddEditView from "features/architecture_status/architecture_statusAddEditView";
import ArchiveObjectFileNotLinkedView from "features/ArchiveObjectFile/ArchiveObjectFileNotLinked"
import WorkDocumentTypeListView from "features/WorkDocumentType/WorkDocumentTypeListView";
import WorkDocumentTypeAddEditView from "features/WorkDocumentType/WorkDocumentTypeAddEditView";
import StructureTemplatesListView from "features/StructureTemplates/StructureTemplatesListView";
import StructureTemplatesAddEditView from "features/StructureTemplates/StructureTemplatesAddEditView";
import ReleaseAddEditView from 'features/release/releaseAddEditView';
import ReleaseListView from 'features/release/releaseListView';
import DarekView from "features/DarekView";
import TechCouncilListView from "features/TechCouncil/TechCouncilListView";
import TechCouncilAddEditView from "features/TechCouncil/TechCouncilAddEditView";
import TechCouncilApplicationView from "features/TechCouncil/TechCouncilApplicationView";

import Legal_act_objectAddEditView from 'features/legal_act_object/legal_act_objectAddEditView';
import Legal_act_objectListView from 'features/legal_act_object/legal_act_objectListView';
import Application_legal_recordAddEditView from 'features/application_legal_record/application_legal_recordAddEditView';
import Application_legal_recordListView from 'features/application_legal_record/application_legal_recordListView';
import Legal_record_objectAddEditView from 'features/legal_record_object/legal_record_objectAddEditView';
import Legal_record_objectListView from 'features/legal_record_object/legal_record_objectListView';
import Legal_record_registryAddEditView from 'features/legal_record_registry/legal_record_registryAddEditView';
import Legal_record_registryListView from 'features/legal_record_registry/legal_record_registryListView';
import Legal_objectAddEditView from 'features/legal_object/legal_objectAddEditView';
import Legal_objectListView from 'features/legal_object/legal_objectListView';
import Legal_registry_statusAddEditView from 'features/legal_registry_status/legal_registry_statusAddEditView';
import Legal_registry_statusListView from 'features/legal_registry_status/legal_registry_statusListView';
import Legal_act_registryAddEditView from 'features/legal_act_registry/legal_act_registryAddEditView';
import Legal_act_registryListView from 'features/legal_act_registry/legal_act_registryListView';
import Legal_act_registry_statusAddEditView from 'features/legal_act_registry_status/legal_act_registry_statusAddEditView';
import Legal_act_registry_statusListView from 'features/legal_act_registry_status/legal_act_registry_statusListView';
import TechCouncilSessionAddEditView from 'features/TechCouncilSession/TechCouncilSessionAddEditView';
import TechCouncilSessionListView from 'features/TechCouncilSession/TechCouncilSessionListView';
import SecurityEventListView from 'features/SecurityEvent/SecurityEventListView';
import IncomeListView from 'features/income_list';
import ServicePriceListView from 'features/ServicePrice/ServicePriceListView';
import ServicePriceAddEditView from 'features/ServicePrice/ServicePriceAddEditView';
import FileDownloadLogListView from 'features/FileDownloadLog/FileDownloadLogListView';
import DutyPlanLogListView from 'features/DutyPlanLog/DutyPlanLogListView';
import Service_pathAddEditView from 'features/service_path/service_pathAddEditView';
import Service_pathListView from 'features/service_path/service_pathListView';
import Path_stepAddEditView from 'features/path_step/path_stepAddEditView';
import Path_stepListView from 'features/path_step/path_stepListView';
import Step_dependencyAddEditView from 'features/step_dependency/step_dependencyAddEditView';
import Step_dependencyListView from 'features/step_dependency/step_dependencyListView';
import LawDocumentTypeAddEditView from 'features/LawDocumentType/LawDocumentTypeAddEditView';
import LawDocumentTypeListView from 'features/LawDocumentType/LawDocumentTypeListView';
import LawDocumentAddEditView from 'features/LawDocument/LawDocumentAddEditView';
import LawDocumentListView from 'features/LawDocument/LawDocumentListView';
import ApplicationRequiredCalcAddEditView from 'features/ApplicationRequiredCalc/ApplicationRequiredCalcAddEditView';
import ApplicationRequiredCalcListView from 'features/ApplicationRequiredCalc/ApplicationRequiredCalcListView';
import StepRequiredCalcAddEditView from 'features/StepRequiredCalc/StepRequiredCalcAddEditView';
import StepRequiredCalcListView from 'features/StepRequiredCalc/StepRequiredCalcListView';
import DocumentJournalsAddEditView from 'features/DocumentJournals/DocumentJournalsAddEditView';
import DocumentJournalsListView from 'features/DocumentJournals/DocumentJournalsListView';
import ApplicationOutgoingDocumentListView from 'features/ApplicationOutgoingDocument/ApplicationOutgoingDocumentListView';
import JournalTemplateTypeAddEditView from 'features/JournalTemplateType/JournalTemplateTypeAddEditView';
import JournalTemplateTypeListView from 'features/JournalTemplateType/JournalTemplateTypeListView';
import JournalApplicationListView from 'features/JournalApplication/JournalApplicationListView';

import Reports from 'features/Dashboard_headDepartment/reports';
import { JournalTemplateType } from "./constants/JournalTemplateType";

const router = createBrowserRouter([
  {
    element: (
      <MainWrapper>
        <Outlet />
      </MainWrapper>
    ),
    children: [
      {
        element: <PrivateRoute />,
        children: [
          {
            element: <MainLayout />,
            path: "/user",
            children: [
              { path: "Report", element: <Reports custom={true} /> },
              { path: "AttributeType", element: <AttributeTypeListView /> },
              { path: "AttributeType/addedit", element: <AttributeTypeAddEditView /> },
              { path: "notification_template", element: <Notification_templateListView /> },
              { path: "notification_template/addedit", element: <Notification_templateAddEditView /> },
              { path: "SmProject", element: <SmProjectListView /> },
              { path: "SmProject/addedit", element: <SmProjectAddEditView /> },
              { path: "Communication", element: <CommunicationView /> },
              { path: 'release', element: <ReleaseListView /> },
              { path: 'release/addedit', element: <ReleaseAddEditView /> },
              { path: 'SecurityEvent', element: <SecurityEventListView /> },

              { path: "S_PlaceHolderType", element: <S_PlaceHolderTypeListView /> },
              { path: "S_PlaceHolderType/addedit", element: <S_PlaceHolderTypeAddEditView /> },
              { path: "S_TemplateDocumentPlaceholder", element: <S_TemplateDocumentPlaceholderListView /> },
              { path: "S_TemplateDocumentPlaceholder/addedit", element: <S_TemplateDocumentPlaceholderAddEditView /> },
              { path: "S_Query", element: <S_QueryListView /> },
              { path: "S_Query/addedit", element: <S_QueryAddEditView /> },
              { path: "CustomSvgIcon", element: <CustomSvgIconListView /> },
              { path: "CustomSvgIcon/addedit", element: <CustomSvgIconAddEditView /> },
              { path: "S_QueriesDocumentTemplate", element: <S_QueriesDocumentTemplateListView /> },
              { path: "S_QueriesDocumentTemplate/addedit", element: <S_QueriesDocumentTemplateAddEditView /> },
              { path: "S_DocumentTemplate", element: <S_DocumentTemplateListView /> },
              { path: "S_DocumentTemplate/addedit", element: <S_DocumentTemplateAddEditView /> },
              { path: "Language", element: <LanguageListView /> },
              { path: "Language/addedit", element: <LanguageAddEditView /> },
              { path: "S_DocumentTemplateType", element: <S_DocumentTemplateTypeListView /> },
              { path: "S_DocumentTemplateType/addedit", element: <S_DocumentTemplateTypeAddEditView /> },
              { path: "work_schedule", element: <Work_scheduleListView /> },
              { path: "work_schedule/addedit", element: <Work_scheduleAddEditView /> },
              { path: "org_structure", element: <Org_structureListView /> },
              { path: "org_structure/addedit", element: <Org_structureAddEditView /> },

              { path: "ApplicationDocumentType", element: <ApplicationDocumentTypeListView /> },
              { path: "ApplicationDocument", element: <ApplicationDocumentListView /> },
              { path: "ApplicationDocument/addedit", element: <ApplicationDocumentAddEditView /> },
              { path: "FileTypeForApplicationDocument", element: <FileTypeForApplicationDocumentListView /> },
              { path: "Service", element: <ServiceListView /> },
              { path: "Service/addedit", element: <ServiceAddEditView /> },
              { path: "Employee", element: <EmployeeListView /> },
              { path: "Employee/addedit", element: <EmployeeAddEditView /> },
              { path: "Customer", element: <CustomerListView /> },
              { path: "Customer/addedit", element: <CustomerAddEditView /> },
              { path: "Application", element: <ApplicationListView /> },
              { path: "AppsFromCabinet", element: <ApplicationFromCabinetListView /> },
              { path: "ApplicationFinPlan", element: <ApplicationListView finPlan /> },
              { path: "Application/addedit", element: <ApplicationAddEditView /> },
              // { path: "ApplicationStatusHistory/", element: <ApplicationStatusHistoryListView /> },


              { path: "StructuresPayment", element: <ApplicationPaymentListView /> },
              // { path: "ApplicationPayment/addedit", element: <ApplicationPaymentAddEditView /> },

              { path: "ArchObject", element: <ArchObjectListView /> },
              { path: "ArchObject/addedit", element: <ArchObjectAddEditView /> },
              { path: "archive_folder", element: <Archive_folderListView /> },
              { path: "archive_folder/addedit", element: <Archive_folderAddEditView /> },
              { path: "District", element: <DistrictListView /> },
              { path: "District/addedit", element: <DistrictAddEditView /> },
              { path: "Workflow", element: <WorkflowListView /> },
              { path: "Workflow/addedit", element: <WorkflowAddEditView /> },

              { path: "StructurePost", element: <StructurePostListView /> },
              { path: "CustomerRepresentative", element: <CustomerRepresentativeListView /> },

              { path: "account-settings", element: <AccountSettings /> },
              { path: "contact_type", element: <Contact_typeListView /> },
              { path: "contact_type/addedit", element: <Contact_typeAddEditView /> },
              { path: "organization_type", element: <Organization_typeListView /> },
              { path: "organization_type/addedit", element: <Organization_typeAddEditView /> },
              { path: "notification", element: <NotificationListView /> },
              { path: "notificationLog", element: <NotificationLogListView /> },
              { path: "AppNotification", element: <ApplicationNotificationLogListView /> },
              { path: "notification/addedit", element: <NotificationAddEditView /> },
              { path: "tag", element: <TagListView /> },
              { path: "tag/addedit", element: <TagAddEditView /> },
              { path: "comments", element: <ApplicationCommentsListView /> },
              { path: "ApplicationReport", element: <ApplicationReportListView isOrg={false} /> },
              { path: "ApplicationOrganizationReport", element: <ApplicationReportListView isOrg={true} /> },
              // { path: 'my_tasks', element: <MyTasks my_tasks /> },
              { path: 'my_apps', element: <MyApps /> },
              // { path: 'structure_tasks', element: <MyTasks /> },

              { path: 'my_tasks', element: <ApplicationListView key="my_tasks" filterByEmployee={true} /> },
              { path: 'structure_tasks', element: <ApplicationListView key="structure_tasks" filterByOrgStructure={true} /> },

              { path: 'all_tasks', element: <AllTasks /> },
              { path: 'task_type', element: <Task_typeListView /> },
              { path: 'task_type/addedit', element: <Task_typeAddEditView /> },
              { path: 'task_status', element: <Task_statusListView /> },
              { path: 'task_status/addedit', element: <Task_statusAddEditView /> },
              { path: 'architecture_status', element: <Architecture_statusListView /> },
              { path: 'architecture_status/addedit', element: <Architecture_statusAddEditView /> },
              { path: 'application_task/addedit', element: <TaskCard /> },
              { path: 'task', element: <ApplicationTaskAddEditView /> },
              { path: 'reports', element: <ReportView /> },
              { path: 'reportsConfig', element: <ReportConfig /> },
              { path: 'structureReportsConfig', element: <StructureReportConfigView /> },
              { path: 'application_subtask/addedit', element: <ApplicationSubTaskAddEditView /> },
              { path: 'applicationPaidInvoiceTaxListView', element: <ApplicationPaidInvoiceTaxListView /> },

              { path: 'HrmsEventType', element: <HrmsEventTypeListView /> },
              { path: 'Contragent_interaction', element: <Contragent_interactionListView /> },
              { path: 'Contragent_interaction/addedit', element: <Contragent_interactionAddEditView /> },
              { path: 'ApplicationRoad', element: <ApplicationRoadListView /> },
              { path: 'ArchitectureRoad', element: <ArchitectureListView /> },
              { path: 'faq_question', element: <Faq_questionView /> },
              { path: 'Dashboard', element: <DashboardView /> },
              { path: 'DashboardHead', element: <DashboardHead /> },
              { path: 'DashboardEmployee', element: <DashboardEmployeeView /> },
              { path: 'faq_question/addedit', element: <Faq_questionAddEditView /> },
              { path: '', element: <Faq_questionAccordions /> },
              { path: "MyCustomSubscribtion", element: <CustomSubscribtionListView forMe={true} /> },
              { path: "MyCustomSubscribtion/addedit", element: <CustomSubscribtionAddEditView forMe={true} /> },
              { path: "CustomSubscribtion", element: <CustomSubscribtionListView /> },
              { path: "CustomSubscribtion/addedit", element: <CustomSubscribtionAddEditView /> },

              { path: "TelegramAdmin", element: <TelegramAdminListVew /> },
              { path: "TelegramAdmin/addedit", element: <TelegramAdminAddEditView /> },
              { path: "ArchiveObject", element: <ArchiveObjectListVew /> },
              { path: "ArchiveObject/addedit", element: <ArchiveObjectAddEditView /> },
              { path: "ArchitectureProcess", element: <ArchitectureProcess /> },
              { path: "ArchitectureProcessToArchive", element: <ArchitectureProcess toArchive={true} /> },
              { path: "ArchitectureProcess/addedit", element: <ArchiveObjectFromAppEdit /> },
              { path: 'structure_application_log', element: <Structure_application_logListView /> },
              { path: 'structure_application_log/addedit', element: <Structure_application_logAddEditView /> },


              { path: "ArchiveLogStatus", element: <ArchiveLogStatusListVew /> },
              { path: "ArchiveLogStatus/addedit", element: <ArchiveLogStatusAddEditView /> },
              { path: "ArchiveLog", element: <ArchiveLogListVew /> },
              { path: "ArchiveLog/addedit", element: <ArchiveLogAddEditView /> },
              // TODO remove MyEmployees
              // { path: "MyEmployees", element: <MyEmployeesListView /> },
              { path: 'reestr', element: <ReestrListView /> },
              { path: 'ReestrOtchet', element: <ReestrOtchetView /> },
              { path: 'ReestrRealization', element: <ReestrRealizationView /> },
              { path: 'ReestrTax', element: <ReestrTaxView /> },
              { path: 'ReestrSvodnaya', element: <ReestrSvodnayaView /> },
              { path: 'reestr/addedit', element: <ReestrAddEditView /> },
              { path: 'AppFilter', element: <AppFilterView /> },
              // { path: 'DashboardHeadDepartment', element: <DashboarHeadDepartmentdView /> },
              { path: 'DashboardHeadDepartment', element: <DashboardHead /> },
              { path: 'FilterApplication', element: <ApplicationFilterListView /> },
              { path: 'FilterApplication/addedit', element: <ApplicationFilterAddEditView /> },
              { path: 'FilterTypeApplication', element: <ApplicationFilterTypeListView /> },
              { path: 'FilterTypeApplication/addedit', element: <ApplicationFilterTypeAddEditView /> },

              { path: 'Structure_report', element: <Structure_reportListView /> },
              { path: 'Structure_report/addedit', element: <Structure_reportAddEditView /> },
              { path: 'Structure_report_config', element: <Structure_report_configtListView /> },
              { path: 'Structure_report_config/addedit', element: <Structure_report_configAddEditView /> },
              { path: 'Structure_report_field', element: <Structure_report_fieldListView /> },
              { path: 'Structure_report_field/addedit', element: <Structure_report_fieldAddEditView /> },
              { path: 'Structure_report_field_config', element: <Structure_report_field_configListView /> },
              { path: 'Structure_report_field_config/addedit', element: <Structure_report_field_configAddEditView /> },
              { path: 'Structure_report_status', element: <Structure_report_statusListView /> },
              { path: 'Structure_report_status/addedit', element: <Structure_report_statusAddEditView /> },
              { path: 'Unit_for_field_config', element: <Unit_for_field_configListView /> },
              { path: 'Unit_for_field_config/addedit', element: <Unit_for_field_configAddEditView /> },
              { path: 'Unit_type', element: <Unit_typeListView /> },
              { path: 'Unit_type/addedit', element: <Unit_typeAddEditView /> },

              { path: 'CustomerDiscount', element: <CustomerDiscountListView /> },
              { path: 'CustomerDiscount/addedit', element: <CustomerDiscountAddEditView /> },
              { path: 'DiscountDocuments', element: <DiscountDocumentsListView /> },
              { path: 'DiscountDocuments/addedit', element: <DiscountDocumentsAddEditView /> },
              { path: 'DiscountType', element: <DiscountTypeListView /> },
              { path: 'DiscountType/addedit', element: <DiscountTypeAddEditView /> },
              { path: 'DiscountDocumentType', element: <DiscountDocumentTypeListView /> },
              { path: 'DiscountDocumentType/addedit', element: <DiscountDocumentTypeAddEditView /> },
              { path: 'QueryFilters', element: <QueryFiltersListView /> },
              { path: 'QueryFilters/addedit', element: <QueryFiltersEditView /> },
              { path: 'ArchiveFileNotLinked', element: <ArchiveObjectFileNotLinkedView /> },
              { path: 'WorkDocumentType', element: <WorkDocumentTypeListView /> },
              { path: 'WorkDocumentType/addedit', element: <WorkDocumentTypeAddEditView /> },
              { path: 'StructureTemplates', element: <StructureTemplatesListView /> },
              { path: 'StructureTemplates/addedit', element: <StructureTemplatesAddEditView /> },
              { path: 'DarekView', element: <DarekView /> },
              { path: 'TechCouncil', element: <TechCouncilListView /> },
              { path: 'TechCouncil/addedit', element: <TechCouncilAddEditView /> },
              { path: 'TechCouncilApplication', element: <TechCouncilApplicationView /> },

              { path: 'legal_act_object', element: <Legal_act_objectListView /> },
              { path: 'legal_act_object/addedit', element: <Legal_act_objectAddEditView /> },
              { path: 'application_legal_record', element: <Application_legal_recordListView /> },
              { path: 'application_legal_record/addedit', element: <Application_legal_recordAddEditView /> },
              { path: 'legal_record_object', element: <Legal_record_objectListView /> },
              { path: 'legal_record_object/addedit', element: <Legal_record_objectAddEditView /> },
              { path: 'legal_record_registry', element: <Legal_record_registryListView /> },
              { path: 'legal_record_registry/addedit', element: <Legal_record_registryAddEditView /> },
              { path: 'legal_object', element: <Legal_objectListView /> },
              { path: 'legal_object/addedit', element: <Legal_objectAddEditView /> },
              { path: 'legal_registry_status', element: <Legal_registry_statusListView /> },
              { path: 'legal_registry_status/addedit', element: <Legal_registry_statusAddEditView /> },
              { path: 'legal_act_registry', element: <Legal_act_registryListView /> },
              { path: 'legal_act_registry/addedit', element: <Legal_act_registryAddEditView /> },
              { path: 'legal_act_registry_status', element: <Legal_act_registry_statusListView /> },
              { path: 'legal_act_registry_status/addedit', element: <Legal_act_registry_statusAddEditView /> },
              { path: 'TechCouncilSession', element: <TechCouncilSessionListView isArchive={false} /> },
              { path: 'TechCouncilArchiveSession', element: <TechCouncilSessionListView isArchive={true} /> },
              { path: 'TechCouncilSession/addedit', element: <TechCouncilSessionAddEditView /> },
              { path: 'Income', element: <IncomeListView /> },
              { path: 'ServicePrice', element: <ServicePriceListView /> },
              { path: 'ServicePrice/addedit', element: <ServicePriceAddEditView /> },
              { path: "DutyPlanLog", element: <DutyPlanLogListView /> },
              { path: 'FileDownloadLog', element: <FileDownloadLogListView /> },
              { path: 'service_path', element: <Service_pathListView /> },
              { path: 'service_path/addedit', element: <Service_pathAddEditView /> },
              { path: 'path_step', element: <Path_stepListView /> },
              { path: 'path_step/addedit', element: <Path_stepAddEditView /> },
              { path: 'step_dependency', element: <Step_dependencyListView /> },
              { path: 'step_dependency/addedit', element: <Step_dependencyAddEditView /> },

              { path: 'LawDocumentType', element: <LawDocumentTypeListView /> },
              { path: 'LawDocumentType/addedit', element: <LawDocumentTypeAddEditView /> },
              { path: 'LawDocument', element: <LawDocumentListView /> },
              { path: 'LawDocument/addedit', element: <LawDocumentAddEditView /> },
              { path: 'ApplicationRequiredCalc', element: <ApplicationRequiredCalcListView /> },
              { path: 'ApplicationRequiredCalc/addedit', element: <ApplicationRequiredCalcAddEditView /> },
              { path: 'StepRequiredCalc', element: <StepRequiredCalcListView /> },
              { path: 'StepRequiredCalc/addedit', element: <StepRequiredCalcAddEditView /> },
              { path: 'DocumentJournals', element: <DocumentJournalsListView /> },
              { path: 'DocumentJournals/addedit', element: <DocumentJournalsAddEditView /> },
              { path: 'ApplicationOutgoingDocument', element: <ApplicationOutgoingDocumentListView /> },
              { path: 'JournalTemplateType', element: <JournalTemplateTypeListView /> },
              { path: 'JournalTemplateType/addedit', element: <JournalTemplateTypeAddEditView /> },
              { path: 'JournalApplication', element: <JournalApplicationListView /> },
            ]
          }]
      },
      {
        element: <PublicRoute />,
        children: [

          { path: "/login", element: <SignIn /> },
          { path: "/", element: <SignIn /> },
          { path: "/forgotPassword", element: <ForgotPassword /> },

        ]
      },

      // { path: "Login", element: <AuthLogin /> },
      // { path: "/login", element: <SignIn /> },
      // { path: "/", element: <SignIn /> },
      // { path: "/forgotPassword", element: <ForgotPassword /> },
      { path: "error-404", element: <div></div> },
      { path: "access-denied", element: <div></div> },
      { path: "*", element: <div>not founded</div> }
    ]
  }
]);

const App = () => {
  return <StyledEngineProvider injectFirst>
    <ThemeProvider theme={themes(null)}>
      <NavigationScroll>
        <RouterProvider router={router} />
      </NavigationScroll>
    </ThemeProvider>
  </StyledEngineProvider>;
};

export default App;
