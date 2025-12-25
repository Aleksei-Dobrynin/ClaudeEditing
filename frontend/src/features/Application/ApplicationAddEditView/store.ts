import { makeAutoObservable, reaction, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { addToFavorite, deleteToFavorite, getApplication, getStatusFavorite } from "api/Application/useGetApplication";
import { changeApplicationStatus, createApplication } from "api/Application/useCreateApplication";
import { approveApplication, rejectApplication, updateApplication } from "api/Application/useUpdateApplication";
import { getCustomersBySearch } from "api/Customer/useGetCustomers";
import { getArchObjects } from "../../../api/ArchObject/useGetArchObjects";
import { getServices } from "../../../api/Service/useGetServices";
import { getArchObjectTag } from "../../../api/ArchObject/useGetArchObjectTag";
import commentStore from "../../ApplicationComments/ApplicationCommentsListView/store";
import ApplicationCommentsStore from "../../ApplicationComments/ApplicationCommentsListView/store";
import { getApplicationStatuss } from "api/ApplicationStatus/useGetApplicationStatuses";
import { getApplicationRoads } from "../../../api/ApplicationRoad/useGetApplicationRoads";
import { ErrorResponseCode, SelectOrgStructureForWorklofw, APPLICATION_STATUSES, ContactTypes } from "constants/constant";
import { getCompanyByPin, getCustomer } from "api/Customer/useGetCustomer";
import { getcustomer_contactsBycustomer_id } from "api/customer_contact";
import { Customer } from "constants/Customer";
import { getorganization_types } from "api/organization_type";
import { getidentity_document_types } from "api/identity_document_type";
import dayjs from "dayjs";
import { CustomerRepresentative } from "constants/CustomerRepresentative";
import storeObject from "./storeObject";
import { getobject_tags } from "api/object_tag";
import { getWorkflowTaskTemplates } from "api/WorkflowTaskTemplate/useGetWorkflowTaskTemplates";
import { getCountries } from "../../../api/Country/GetCountries";
import { sendNotification } from "../../../api/Application/useNotificationApplication";
import PopupApplicationStore from "../PopupAplicationListView/store";

import { GetMyCurrentStructure } from "api/EmployeeInStructure/useGetEmployeeStructures";
import { getorg_structures } from "api/org_structure";
import { EOStructureCode } from "constants/constant";
import { getApplicationWorkDocumentsByIDApplication } from "api/ApplicationWorkDocument/useGetApplicationWorkDocuments";
import { getuploaded_application_documentsBy } from "api/uploaded_application_document/index";
import { sendApplicationDocumentToemail } from "api/ApplicationWorkDocument/useCreateApplicationWorkDocument";
//   224 id единое окно 

interface TundukData {
  fullNameOl: string;
  street: string;
  house: string;
  chief: string;
  categorySystemId: number;
  categorySystemName: string;
  statSubCode: string;
  registrCode: string;
  phones: string;
  email1: string;
  email2: string;
}

class NewStore {
  id = 0;
  is_application_read_only = true;
  registration_date = null;
  updated_at = null;
  customer_id = 0;
  total_sum = 0;
  arch_object_id = 0;
  arch_object_district = "";
  status_id = 0;
  status_code = "";
  workflow_id = 0;
  workflow_id_for_structure = null;
  service_id = 0;
  district_id = 0;
  arch_process_id = null;
  deadline = null;
  workflow_task_structure_id = null;
  comment = "";
  is_paid = false;
  is_favorite = false;
  number = "";
  cabinet_html = ""; //TODO delete
  app_cabinet_uuid = ""; //TODO delete
  new_arch_object = "";
  new_pin = "";
  created_by_name = "";
  created_at = null;
  work_description = "";
  incoming_numbers = "";
  outgoing_numbers = "";
  object_tag_id = 0;
  errorwork_description = "";
  errorregistration_date = "";
  errorcustomer_id = "";
  errorarch_object_id = "";
  errorstatus_id = "";
  errorworkflow_id = "";
  errorservice_id = "";
  errordeadline = "";
  errorcomment = "";
  errordistrict_id = "";
  errorobject_tag_id = "";
  errorincoming_numbers = "";
  erroroutgoing_numbers = "";
  Customers = [];
  ArchObjects = [];
  Services = [];
  Districts = [];
  Statuses = [];
  ApplicationRoads = [];
  ArchObjectTag = [];
  CustomerContacts = [];
  selectedDocumentIds = [];
  Countries = [];
  openCustomerPanel = false;
  openStatusHistoryPanel = false;
  openPanelProcess = false;
  openArchObjectPanel = false;
  openCustomerRepresentativePanel = false;
  customerInputValue = "";
  customerLoading = false;
  isOpenTechCouncil = false;
  objectName = "";
  objectAddress = "";
  objectDescription = "";
  objectLoading = false;
  openHistoryForm = false;
  openSendDocumentPanel = false;
  objectInputValue = "";
  customer: Customer = {
    id: 0,
    pin: "",
    is_organization: false,
    full_name: "",
    address: "",
    director: "",
    okpo: "",
    organization_type_id: 0,
    payment_account: "",
    postal_code: "",
    ugns: "",
    bank: "",
    bik: "",
    registration_number: "",
    sms_1: "",
    sms_2: "",
    email_1: "",
    email_2: "",
    telegram_1: "",
    telegram_2: "",
    document_date_issue: null,
    document_serie: "ID AN ",
    identity_document_type_id: null,
    document_whom_issued: "МКК ",
    individual_surname: "",
    individual_name: "",
    individual_secondname: "",
    is_foreign: false,
    foreign_country: null,
    customerRepresentatives: [],
  };
  customerErrors: { [key: string]: string } = {};
  WorkflowTaskTemplates = [];
  OrganizationTypes = [];
  ObjectTags = [];
  Identity_document_types = [];
  MyCurrentStructure = 0;
  org_structures = []

  badgeCount = 0;
  loading = false;

  openCabinetReject = false;
  openCabinetApprove = false;

  openSmsForm = false;
  smsDescription = "";
  telegramDescription = "";
  is_electronic_only = false;
  selectedSms = new Set<string>();
  selectedTelegram = new Set<string>();

  incomingDocuments = [];
  outgoingDocuments = [];
  workDocuments = [];
  selectedIncomingDocuments = [];
  selectedOutgoingDocuments = [];
  selectedWorkDocuments = [];
  favorite = [];
  tundukData: TundukData;
  fields = [
    { key: "full_name", tunduk: "fullNameOl", label: "label:CustomerAddEditView.full_name" },
    { key: "address", tunduk: "street", label: "label:CustomerAddEditView.address" },
    { key: "director", tunduk: "chief", label: "label:CustomerAddEditView.director" },
    { key: "organization_type_id", tunduk: "categorySystemId", label: "label:CustomerAddEditView.organization_type_id" },
    { key: "ugns", tunduk: "statSubCode", label: "label:CustomerAddEditView.ugns" },
    { key: "registration_number", tunduk: "registrCode", label: "label:CustomerAddEditView.registration_number" },
    { key: "sms_1", tunduk: "phones", label: "label:CustomerAddEditView.sms_1" },
    { key: "sms_2", tunduk: "phones", label: "label:CustomerAddEditView.sms_2" },
    { key: "email_1", tunduk: "email1", label: "label:CustomerAddEditView.email_1" },
    { key: "email_2", tunduk: "email2", label: "label:CustomerAddEditView.email_2" },
  ];
  isOpenTundukData = false;
  isTundukError = false;

  constructor() {
    makeAutoObservable(this);
    const fav = localStorage.getItem("favorite_services");
    this.favorite = fav ? JSON.parse(fav) : [];
    reaction(
      () => [this.customerInputValue],
      () => this.onInputValueChanged(),
      { delay: 1000 }
    );
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.is_application_read_only = true;
      this.registration_date = null;
      this.updated_at = null;
      this.customer_id = 0;
      this.total_sum = 0;
      this.arch_object_id = 0;
      this.status_id = 0;
      this.status_code = "";
      this.workflow_id = 0;
      this.workflow_id_for_structure = null;
      this.service_id = 0;
      this.district_id = 0;
      this.deadline = null;
      this.workflow_task_structure_id = null;
      this.comment = null;
      this.is_paid = false;
      this.is_favorite = false;
      this.number = "";
      this.new_arch_object = "";
      this.new_pin = "";
      this.created_by_name = "";
      this.created_at = null;
      this.work_description = "";
      this.incoming_numbers = "";
      this.cabinet_html = ""; //TODO DELETE
      this.app_cabinet_uuid = ""; //TODO DELETE
      this.outgoing_numbers = "";
      this.object_tag_id = 0
      this.errorwork_description = "";
      this.errorregistration_date = "";
      this.errorcustomer_id = "";
      this.errorarch_object_id = "";
      this.errorstatus_id = "";
      this.errorworkflow_id = "";
      this.errorservice_id = "";
      this.errordistrict_id = "";
      this.errorobject_tag_id = ""
      this.errordeadline = "";
      this.errorcomment = "";
      this.errorincoming_numbers = "";
      this.erroroutgoing_numbers = "";
      this.Customers = [];
      this.ArchObjects = [];
      this.Services = [];
      this.selectedDocumentIds = [];
      this.openCustomerPanel = false;
      this.openArchObjectPanel = false;
      this.openCustomerRepresentativePanel = false;
      this.customerInputValue = "";
      this.customerLoading = false;
      this.objectAddress = "";
      this.objectName = "";
      this.objectDescription = "";
      this.objectLoading = false;
      this.changeCustomer(null)
      this.openStatusHistoryPanel = false;
      this.openPanelProcess = false;
      this.openSendDocumentPanel = false;
      this.arch_process_id = null;
      this.MyCurrentStructure = 0;
      this.incomingDocuments = [];
      this.outgoingDocuments = [];
      this.workDocuments = [];
      this.selectedIncomingDocuments = [];
      this.selectedOutgoingDocuments = [];
      this.selectedWorkDocuments = [];
      this.is_electronic_only = false;
    });
  }


  clearApplicationData() {
    runInAction(() => {
      // Очищаем только данные, специфичные для заявки
      // НЕ очищаем справочники!
      this.id = 0;
      this.is_application_read_only = true;
      this.registration_date = null;
      this.updated_at = null;
      this.customer_id = 0;
      this.total_sum = 0;
      this.arch_object_id = 0;
      this.arch_object_district = "";
      this.status_id = 0;
      this.status_code = "";
      this.workflow_id = 0;
      this.workflow_id_for_structure = null;
      this.service_id = 0;
      this.district_id = 0;
      this.deadline = null;
      this.workflow_task_structure_id = null;
      this.comment = "";
      this.is_paid = false;
      this.is_favorite = false;
      this.number = "";
      this.cabinet_html = "";
      this.app_cabinet_uuid = "";
      this.new_arch_object = "";
      this.new_pin = "";
      this.created_by_name = "";
      this.created_at = null;
      this.work_description = "";
      this.incoming_numbers = "";
      this.outgoing_numbers = "";
      this.object_tag_id = 0;

      // Очищаем ошибки
      this.errorwork_description = "";
      this.errorregistration_date = "";
      this.errorcustomer_id = "";
      this.errorarch_object_id = "";
      this.errorstatus_id = "";
      this.errorworkflow_id = "";
      this.errorservice_id = "";
      this.errordeadline = "";
      this.errorcomment = "";
      this.errordistrict_id = "";
      this.errorobject_tag_id = "";
      this.errorincoming_numbers = "";
      this.erroroutgoing_numbers = "";

      // Очищаем данные клиента
      this.changeCustomer(null);

      // Очищаем флаги панелей
      this.openCustomerPanel = false;
      this.openStatusHistoryPanel = false;
      this.openPanelProcess = false;
      this.openArchObjectPanel = false;
      this.openCustomerRepresentativePanel = false;
      this.openHistoryForm = false;
      this.openSendDocumentPanel = false;

      // Очищаем временные данные
      this.customerInputValue = "";
      this.customerLoading = false;
      this.objectName = "";
      this.objectAddress = "";
      this.objectDescription = "";
      this.objectLoading = false;
      this.objectInputValue = "";
      this.arch_process_id = null;

      // Очищаем документы
      this.selectedDocumentIds = [];
      this.incomingDocuments = [];
      this.outgoingDocuments = [];
      this.workDocuments = [];
      this.selectedIncomingDocuments = [];
      this.selectedOutgoingDocuments = [];
      this.selectedWorkDocuments = [];
      this.is_electronic_only = false;

      // НЕ ОЧИЩАЕМ СПРАВОЧНИКИ:
      // this.Customers - НЕ очищаем
      // this.ArchObjects - НЕ очищаем
      // this.Services - НЕ очищаем
      // this.Districts - НЕ очищаем
      // this.Statuses - НЕ очищаем
      // this.ApplicationRoads - НЕ очищаем
      // this.ArchObjectTag - НЕ очищаем
      // this.Countries - НЕ очищаем
      // this.WorkflowTaskTemplates - НЕ очищаем
      // this.OrganizationTypes - НЕ очищаем
      // this.ObjectTags - НЕ очищаем
      // this.Identity_document_types - НЕ очищаем
      // this.MyCurrentStructure - НЕ очищаем
      // this.org_structures - НЕ очищаем
    });
  }

  handleChangeLoading() {
    runInAction(() => {
      this.loading = !this.loading;
    })
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  countSMS(text) {
    const firstSMSLimit = 70;
    const nextSMSLimit = 67; // После первого сообщения лимит уменьшается

    if (text == null) return 0;
    if (text.length === 0) return 0;
    if (text.length <= firstSMSLimit) return 1;

    return 1 + Math.ceil((text.length - firstSMSLimit) / nextSMSLimit);
  }

  openSmsPanel() {
    this.openSmsForm = true;
    this.selectedSms = new Set<string>();
    this.selectedTelegram = new Set<string>();

    let name = this.customer?.is_organization ? this.customer?.full_name : this.customer?.individual_surname + " " + this.customer?.individual_name;
    let address = storeObject.arch_objects?.map(x => x.address)?.join(", ");

    let status = this.Statuses.find(x => x.id == this.status_id);

    this.smsDescription = "БГА. " + name + ", договор " + this.number + "\n" + status?.name_kg + "\nадрес " + address + "\nсумма " + this.total_sum;
    //TODO брать из шаблонов
    this.telegramDescription = "БГА. " + name + ", договор " + this.number + "\n" + status?.name_kg + "\nадрес " + address + "\nсумма " + this.total_sum;
  }

  openHistoryPanel() {
    this.openHistoryForm = true;
  }

  handleToggle = (id: number) => {
    if (this.selectedDocumentIds.includes(id)) {
      this.selectedDocumentIds = this.selectedDocumentIds.filter(x => x !== id);
    } else {
      this.selectedDocumentIds = [...this.selectedDocumentIds, id];
    }
  };

  openSendDocumentsPanel() {
    this.openSendDocumentPanel = true;
  }

  loadIncomingDocuments = async (idApplication: number) => {
    MainStore.changeLoader(true);
    const response = await getuploaded_application_documentsBy(idApplication);
    if (response && (response.status === 200 || response.status === 201)) {
      var documents = response.data.filter(x => x.file_name !== null && x.file_name !== "");
      this.incomingDocuments = documents.filter(x => x.is_outcome === null);
      this.outgoingDocuments = documents.filter(x => x.is_outcome === true);
    } else if (response?.response?.status === 422 && response?.response?.data?.errorType === ErrorResponseCode.MESSAGE) {
      const message = JSON.parse(response?.response?.data?.errorMessage)
      MainStore.openErrorDialog(message?.ru, "ОШИБКА!")
    } else {
      throw new Error();
    }
    MainStore.changeLoader(false);

  }

  loadWorkDocuments = async (idApplication: number) => {
    MainStore.changeLoader(true);
    const response = await getApplicationWorkDocumentsByIDApplication(idApplication);
    if (response && (response.status === 200 || response.status === 201)) {
      this.workDocuments = response.data;
    } else if (response?.response?.status === 422 && response?.response?.data?.errorType === ErrorResponseCode.MESSAGE) {
      const message = JSON.parse(response?.response?.data?.errorMessage)
      MainStore.openErrorDialog(message?.ru, "ОШИБКА!")
    } else {
      throw new Error();
    }
    MainStore.changeLoader(false);

  }

  sendSelectedDocumentsToEmail = async () => {
    MainStore.changeLoader(true);
    var data = {
      application: this.id,
      workDocumenstIds: this.selectedWorkDocuments,// TODO chech if actualy needed
      upoloadedDocumentsIds: this.selectedOutgoingDocuments
    }
    const response = await sendApplicationDocumentToemail(data);
    if (response && (response.status === 200 || response.status === 201)) {
      this.openSendDocumentPanel = false;
      MainStore.setSnackbar(i18n.t("Отправлено"));
    } else if (response?.response?.status === 422 && response?.response?.data?.errorType === ErrorResponseCode.MESSAGE) {
      const message = JSON.parse(response?.response?.data?.errorMessage)
      MainStore.openErrorDialog(message?.ru, "ОШИБКА!")
    } else {
      throw new Error();
    }
    MainStore.changeLoader(false);
  }



  async signAndRejectToCabinet(html) {

    try {
      let status = this.Statuses.find(x => x.code === APPLICATION_STATUSES.rejected_cabinet);

      MainStore.changeLoader(true);
      const response = await changeApplicationStatus(this.id, status.id);
      if (response && (response.status === 200 || response.status === 201)) {
        MainStore.setSnackbar(i18n.t("message:statusChanged"));
        this.status_id = status.id;
        this.loadApplication(this.id)
        let rejectData = { uuid: this.app_cabinet_uuid, html: html, documentIds: this.selectedDocumentIds }
        await rejectApplication(rejectData);
      } else if (response?.response?.status === 422 && response?.response?.data?.errorType === ErrorResponseCode.MESSAGE) {
        const message = JSON.parse(response?.response?.data?.errorMessage)
        MainStore.openErrorDialog(message?.ru, "ОШИБКА!")
      } else {
        throw new Error();
      }
    } catch (err) {
      const serverMessage = err?.message || i18n.t("message:somethingWentWrong");
      MainStore.setSnackbar(serverMessage, "error");
    } finally {
      MainStore.changeLoader(false);
      this.openCabinetReject = false;

    }

  }


  async signAndApproveToCabinet() {

    try {
      let status = this.Statuses.find(x => x.code === APPLICATION_STATUSES.approved_cabinet);

      MainStore.changeLoader(true);
      const response = await changeApplicationStatus(this.id, status.id);
      if (response && (response.status === 200 || response.status === 201)) {
        MainStore.setSnackbar(i18n.t("message:statusChanged"));
        this.status_id = status.id;
        this.loadApplication(this.id)
        let approveData = { uuid: this.app_cabinet_uuid, number: this.number }
        await approveApplication(approveData);
      } else if (response?.response?.status === 422 && response?.response?.data?.errorType === ErrorResponseCode.MESSAGE) {
        const message = JSON.parse(response?.response?.data?.errorMessage)
        MainStore.openErrorDialog(message?.ru, "ОШИБКА!")
      } else {
        throw new Error();
      }
    } catch (err) {
      const serverMessage = err?.message || i18n.t("message:somethingWentWrong");
      MainStore.setSnackbar(serverMessage, "error");
    } finally {
      MainStore.changeLoader(false);
      this.openCabinetApprove = false;

    }

  }

  sendSms() {
    MainStore.openErrorConfirm(
      i18n.t("Вы уверены, что хотите отправить данное оповещение"),
      i18n.t("yes"),
      i18n.t("no"),
      async () => {

        try {

          let selectedNumbers = Array.from(this.selectedSms)
          let selectedTgs = Array.from(this.selectedTelegram)

          MainStore.changeLoader(true);
          const response = await sendNotification(this.smsDescription, this.telegramDescription, selectedNumbers, selectedTgs, this.id, this.customer_id);
          if (response.status === 201 || response.status === 200) {
            if (response.data) {
              MainStore.setSnackbar(i18n.t("Отправлено"));
              this.openSmsForm = false;
            } else {
              MainStore.setSnackbar(i18n.t("Произошла ошибка отправки, попробуйте позже"));
            }
          } else {
            throw new Error();
          }
        } catch (err) {
          MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
        } finally {
          MainStore.changeLoader(false);
          MainStore.onCloseConfirm();
        }
      },
      () => MainStore.onCloseConfirm()
    );
  }

  handleChangeCustomer(event) {
    this.customer[event.target.name] = event.target.value;
    // validate(event);
  }

  changeCustomer(value: Customer) {
    this.customer_id = value?.id;
    validate({ target: { value: value?.id, name: "customer_id" } });
    if (value != null) {
      this.loadCustomer(this.customer_id);
    } else {
      this.customer = {
        id: 0,
        pin: "",
        is_organization: false,
        full_name: "",
        address: "",
        director: "",
        okpo: "",
        organization_type_id: 0,
        payment_account: "",
        postal_code: "",
        ugns: "",
        bank: "",
        bik: "",
        registration_number: "",
        sms_1: "",
        sms_2: "",
        email_1: "",
        email_2: "",
        telegram_1: "",
        telegram_2: "",
        document_date_issue: null,
        document_serie: "ID AN ",
        identity_document_type_id: null,
        document_whom_issued: "МКК ",
        individual_surname: "",
        individual_name: "",
        individual_secondname: "",
        customerRepresentatives: [],
        is_foreign: false,
        foreign_country: null,
      };
    }
  }
  changeArchObject(value: any) {
    this.arch_object_id = value?.id;
    validate({ target: { value: value?.id, name: "arch_object_id" } });
    this.objectAddress = value?.address;
    this.objectName = value?.name;
    this.objectDescription = value?.description;
  }

  changeCustomerInput(value: string) {
    if (value !== this.customerInputValue) {
      this.customerInputValue = value;
      // this.loadCustomers();
    }
  }

  onInputValueChanged = () => {
    this.customerLoading = true;
    this.loadCustomers();
  }

  changeObjectInput(value: string) {
    if (value !== this.objectInputValue) {
      this.objectInputValue = value;
      this.objectLoading = true;
      this.loadArchObjects();
    }
  }

  onAddCustomerClicked(pin?: string) {
    runInAction(() => {
      // this.openCustomerPanel = true;
      this.customer.pin = pin;
      this.customer_id = 0;
    });
  }

  onAddArchObjectClicked(name?: string) {
    runInAction(() => {
      this.openArchObjectPanel = true;
      this.new_arch_object = name;
      this.arch_object_id = 0;
    });
  }

  onEditArchObjectClicked() {
    runInAction(() => {
      this.openArchObjectPanel = true;
    });
  }

  setBadge() {
    runInAction(async () => {
      this.badgeCount = await PopupApplicationStore.loadApplications(this.customer.pin, () => this.handleChangeLoading())
    })
  }

  onCustomerRepresentativeClicked() {
    runInAction(() => {
      this.openCustomerRepresentativePanel = true;
    });
  }

  onEditCustomerClicked() {
    runInAction(() => {
      this.openCustomerPanel = true;
    });
  }

  closeCustomerPanel() {
    runInAction(() => {
      this.openCustomerPanel = false;
    });
  }

  changeApplicationHistoryPanel(bool: boolean) {
    runInAction(() => {
      this.openStatusHistoryPanel = bool;
    });
  }

  toDutyPlanClicked(flag: boolean) {
    this.openPanelProcess = flag
  }

  closeCustomerRepresentativePanel() {
    runInAction(() => {
      this.openCustomerRepresentativePanel = false;
    });
  }

  closeArchObjectPanel() {
    runInAction(() => {
      this.openArchObjectPanel = false;
      this.new_arch_object = "";
    });
  }

  setArchObjectId(id: number) {
    this.arch_object_id = id;
  }

  toggleNumberSelection(number) {
    if (this.selectedSms.has(number)) {
      this.selectedSms.delete(number);
    } else {
      this.selectedSms.add(number);
    }
  }

  toggleTelegramSelection(chatId) {
    if (this.selectedTelegram.has(chatId)) {
      this.selectedTelegram.delete(chatId);
    } else {
      this.selectedTelegram.add(chatId);
    }
  }

  async changeToStatus(id: number) { //TODO
    try {
      let status = this.Statuses.find(x => x.id === id);

      if (status.code == APPLICATION_STATUSES.rejected_cabinet) {
        this.openCabinetReject = true;
        return;
      }

      if (status.code == APPLICATION_STATUSES.approved_cabinet) {
        this.openCabinetApprove = true;
        return;
      }

      if (status.code === APPLICATION_STATUSES.to_technical_council) {
        this.isOpenTechCouncil = true;
      }

      MainStore.changeLoader(true);
      const response = await changeApplicationStatus(this.id, id);
      if (response && (response.status === 200 || response.status === 201)) {
        MainStore.setSnackbar(i18n.t("message:statusChanged"));
        this.status_id = id;
        this.loadApplication(this.id)

        if (status.code == APPLICATION_STATUSES.document_ready) {
          this.openSmsPanel();
        }

      } else if (response?.response?.status === 422 && response?.response?.data?.errorType === ErrorResponseCode.MESSAGE) {
        const message = JSON.parse(response?.response?.data?.errorMessage)
        MainStore.openErrorDialog(message?.ru, "ОШИБКА!")
      } else {
        throw new Error();
      }
    } catch (err) {
      const serverMessage = err?.message || i18n.t("message:somethingWentWrong");
      MainStore.setSnackbar(serverMessage, "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  validateCustomerForm = () => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id },
    };
    canSave = validate(event) && canSave;
    event = { target: { name: "customer_id", value: this.customer_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "arch_object_id", value: this.arch_object_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "service_id", value: this.service_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "pin", value: this.customer } };
    canSave = validate(event) && canSave;
    if (!this.customer.is_organization) {
      event = { target: { name: "individual_surname", value: this.customer.individual_surname } };
      canSave = validate(event) && canSave;
      event = { target: { name: "individual_name", value: this.customer.individual_name } };
      canSave = validate(event) && canSave;
      event = { target: { name: "individual_secondname", value: this.customer.individual_secondname } };
      canSave = validate(event) && canSave;
    }

    const saveObject = storeObject.onSaveClick()

    if (!(canSave && saveObject.canSave)) {
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
    }
    return canSave && saveObject.canSave;
  }

  validateObjectForm = () => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id },
    };
    canSave = validate(event) && canSave;
    event = { target: { name: "customer_id", value: this.customer_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "arch_object_id", value: this.arch_object_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "service_id", value: this.service_id } };
    canSave = validate(event) && canSave;

    const saveObject = storeObject.onSaveClick()

    if (!(canSave && saveObject.canSave)) {
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
    }
    return canSave && saveObject.canSave;
  }

  onSaveClick = async (onSaved: (id: number) => void, saveWithoutCheck: boolean = false) => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id },
    };
    canSave = validate(event) && canSave;
    event = { target: { name: "customer_id", value: this.customer_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "arch_object_id", value: this.arch_object_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "service_id", value: this.service_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "pin", value: this.customer } };
    canSave = validate(event) && canSave;
    if (!this.customer.is_organization) {
      event = { target: { name: "individual_surname", value: this.customer.individual_surname } };
      canSave = validate(event) && canSave;
      event = { target: { name: "individual_name", value: this.customer.individual_name } };
      canSave = validate(event) && canSave;
      event = { target: { name: "individual_secondname", value: this.customer.individual_secondname } };
      canSave = validate(event) && canSave;
    }

    const saveObject = storeObject.onSaveClick()
    if (canSave && saveObject.canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          registration_date: this.registration_date,
          customer_id: this.customer_id,
          work_description: this.work_description,
          status_id: this.status_id,
          workflow_id: this.workflow_id,
          service_id: this.service_id,
          deadline: this.deadline,
          workflow_task_structure_id: this.workflow_task_structure_id,
          comment: this.comment,
          arch_object_id: this.arch_object_id,
          updated_at: this.updated_at,
          customer: this.customer,
          archObjects: saveObject.data,
          object_tag_id: this.object_tag_id == 0 ? null : this.object_tag_id,
          incoming_numbers: this.incoming_numbers,
          outgoing_numbers: this.outgoing_numbers,
          saveWithoutCheck: saveWithoutCheck,
        };

        const response =
          data.id === 0 ? await createApplication(data) : await updateApplication(data);

        if (response.status === 201 || response.status === 200) {
          onSaved(response.data.id);
          if (data.id === 0) {
            this.id = response.data.id;
            ApplicationCommentsStore.setApplicationId(response.data.id);
            MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
          } else {
            MainStore.setSnackbar(i18n.t("message:snackbar.successEdit"), "success");
          }
        } else if (
          response?.response?.status === 422 &&
          response?.response?.data?.errorType === ErrorResponseCode.ALREADY_UPDATED
        ) {
          MainStore.openErrorDialog(
            i18n.t("message:snackbar.alreadyUpdated"),
            "Не получилось обновить"
          );
        } else if (
          response?.response?.status === 422 &&
          response?.response?.data?.code === ErrorResponseCode.LOGIC &&
          response?.response?.data?.parameters?.code === "alreadyCreated"
        ) {
          MainStore.onCloseAlert()
          MainStore.openErrorConfirm(
            "Мы нашли похожую заявку! Вы хотите туда перейти?",
            "Да, перейти",
            "Нет, создать заявку",
            () => {
              window.location.href = `/user/Application/addedit?id=${response?.response?.data?.parameters?.id}`
              MainStore.onCloseConfirm()
            },
            async () => {
              await this.onSaveClick(onSaved, true)
              MainStore.onCloseConfirm()
            }
          );
        } else {
          throw new Error();
        }
      } catch (err) {
        MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
      } finally {
        MainStore.changeLoader(false);
      }
    } else {
      MainStore.openErrorDialog(i18n.t("message:error.alertMessageAlert"));
    }
  };

  loadApplication = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplication(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.registration_date = response.data.registration_date;
          this.updated_at = response.data.updated_at;
          this.customer_id = response.data.customer_id;
          this.total_sum = response.data.total_sum;
          this.status_id = response.data.status_id;
          this.status_code = response.data.status_code;
          this.workflow_id = response.data.workflow_id;
          this.service_id = response.data.service_id;
          this.district_id = response.data.district_id;
          this.arch_object_district = response.data.arch_object_district;
          this.deadline = response.data.deadline;
          this.workflow_task_structure_id = response.data.workflow_task_structure_id;
          this.comment = response.data.comment;
          this.arch_object_id = response.data.arch_object_id;
          this.is_paid = response.data.is_paid;
          this.is_favorite = response.data.is_favorite;
          this.number = response.data.number;
          this.created_by_name = response.data.created_by_name;
          this.created_at = response.data.created_at;
          this.work_description = response.data?.work_description;
          this.object_tag_id = response.data?.object_tag_id
          this.incoming_numbers = response.data?.incoming_numbers;
          this.cabinet_html = response.data?.cabinet_html;
          this.app_cabinet_uuid = response.data?.app_cabinet_uuid;
          this.outgoing_numbers = response.data?.outgoing_numbers;
          this.arch_process_id = response.data?.arch_process_id;
          this.is_electronic_only = response.data?.is_electronic_only;

          if (this.workflow_task_structure_id) {
            let service = this.Services.find(x => x.id == this.service_id);
            if (service?.code == SelectOrgStructureForWorklofw.GIVE_DUPLICATE) {
              this.workflow_id_for_structure = service.workflow_id;
            }
          }

        });
        this.loadCustomer(this.customer_id);
        ApplicationCommentsStore.setApplicationId(response.data.id);
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadServices = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getServices();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const today = dayjs();

        this.Services = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadStatuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationStatuss();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Statuses = response.data.filter((x) => x.name);
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadApplicationRoads = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationRoads();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ApplicationRoads = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadCustomers = async () => {
    try {
      const response = await getCustomersBySearch(this.customerInputValue);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Customers = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      this.customerLoading = false;
    }
  };

  deleteRepresentative = (id: number) => {
    this.customer.customerRepresentatives = this.customer.customerRepresentatives.filter(x => x.id !== id);
  }
  addedNewRepresentative = (repr: CustomerRepresentative) => {
    const find = this.customer.customerRepresentatives.find(x => x.id === repr.id)
    if (find) { // если мы редактировали
      const index = this.customer.customerRepresentatives.indexOf(find)
      this.customer.customerRepresentatives[index] = repr
    } else {
      this.customer.customerRepresentatives = [...this.customer.customerRepresentatives, repr]
    }
  }

  setCustomerData = (data: Customer) => {
    this.customer = {
      id: data.id,
      pin: data.pin,
      is_organization: data.is_organization,
      full_name: data.full_name,
      address: data.address,
      director: data.director,
      okpo: data.okpo,
      postal_code: data.postal_code,
      ugns: data.ugns,
      bank: data.bank,
      bik: data.bik,
      sms_1: data.sms_1,
      sms_2: data.sms_2,
      email_1: data.email_1,
      email_2: data.email_2,
      telegram_1: data.telegram_1,
      telegram_2: data.telegram_2,
      payment_account: data.payment_account,
      registration_number: data.registration_number,
      organization_type_id: data.organization_type_id,
      individual_name: data.individual_name,
      individual_secondname: data.individual_secondname,
      individual_surname: data.individual_surname,
      identity_document_type_id: data.identity_document_type_id,
      document_serie: data.document_serie,
      document_date_issue: data.document_date_issue,
      document_whom_issued: data.document_whom_issued,
      customerRepresentatives: data.customerRepresentatives,
      is_foreign: data.is_foreign,
      foreign_country: data.foreign_country,
    };
    if (!data.document_serie) {
      this.customer.document_serie = "ID AN "
    }
    if (!data.document_whom_issued) {
      this.customer.document_whom_issued = "МКК "
    }
  };

  loadCustomer = async (customer_id: number) => {
    try {
      const response = await getCustomer(customer_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.setCustomerData(response.data)
        this.badgeCount = await PopupApplicationStore.loadApplications(this.customer.pin, () => this.handleChangeLoading())

      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      this.customerLoading = false;
    }
  };

  loadCustomerContacts = async (customer_id: number) => {
    try {
      if (customer_id == null) return;
      const response = await getcustomer_contactsBycustomer_id(customer_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.CustomerContacts = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      this.customerLoading = false;
    }
  };

  loadArchObjects = async () => {
    try {
      const response = await getArchObjects();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ArchObjects = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      this.objectLoading = false;
    }
  };

  loadWorkflowTaskTemplates = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getWorkflowTaskTemplates();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.WorkflowTaskTemplates = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };


  loadorganization_types = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getorganization_types();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.OrganizationTypes = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
  loadobject_tags = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getobject_tags();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ObjectTags = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadIdentity_document_types = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getidentity_document_types();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Identity_document_types = response.data;
        let foundItem = this.Identity_document_types.find(item => item.code === "passport");
        this.customer.identity_document_type_id = foundItem.id
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadArchObjectsTag = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchObjectTag(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ArchObjectTag = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadCountries = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getCountries();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Countries = response.data
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loadMyCurrentStructure = async () => {


    try {
      MainStore.changeLoader(true);
      const response = await GetMyCurrentStructure();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.MyCurrentStructure = response.data
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async loadorg_structures() {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.org_structures = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  checkStructureEOId() {
    if (this.org_structures != null) {
      var EO = this.org_structures.find(x => x.version == EOStructureCode);
      if (EO && EO.id == this.MyCurrentStructure)
        return true;
    }
    return false;
  }

  async doLoad(id: number) {
    this.loadCustomers();
    this.loadServices();
    // this.loadDistricts();
    this.loadStatuses();
    this.loadApplicationRoads();
    this.loadorganization_types();
    this.loadobject_tags();
    this.loadIdentity_document_types();
    this.loadWorkflowTaskTemplates();
    this.loadCountries();
    this.loadMyCurrentStructure()
    this.loadorg_structures()
    this.loadCustomerContacts(this.customer_id);
    storeObject.doLoad(id)

    this.id = id;
    if (id == null || id == 0) {
      this.is_application_read_only = false;
      return;
    }
    await this.loadApplication(id);
    commentStore.loadAllComments(id);
  }

  setFavorit(serviceId: number) {
    if (this.favorite.includes(serviceId)) {
      this.favorite = this.favorite.filter(id => id !== serviceId);
    } else {
      this.favorite.push(serviceId);
    }
    localStorage.setItem("favorite_services", JSON.stringify(this.favorite));
  }

  isFavorit(serviceId: number) {
    return this.favorite.includes(serviceId);
  }

  get sortService() {
    const favs = this.Services.filter(s => this.favorite.includes(s.id));
    const rest = this.Services.filter(s => !this.favorite.includes(s.id));
    return [...favs, ...rest];
  }

  async findCompanyByPin(pin: string) {
    try {
      const response = await getCompanyByPin(pin);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.tundukData = response.data;
        this.isOpenTundukData = true;
      } else {
        this.isTundukError = true;
        throw new Error();
      }
    } catch (err) {
      this.isTundukError = true;
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      this.customerLoading = false;
    }
  }

  async setFavorite() {
    try {
      MainStore.changeLoader(true);
      var set = this.is_favorite ? await deleteToFavorite(this.id) : await addToFavorite(this.id);
      const response = await getStatusFavorite(this.id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.is_favorite = response.data;
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  keepCurrentData() {
    this.isOpenTundukData = false;
  }

  applyTundukData() {
    const phones = this.tundukData.phones
      ? this.tundukData.phones.split(',').map(p => p.trim()).filter(Boolean)
      : [];
    this.customer.is_organization = true;
    this.customer.full_name = this.tundukData.fullNameOl;
    this.customer.address = `${this.tundukData.street} ${this.tundukData.house}`;
    this.customer.director = this.tundukData.chief;
    this.customer.organization_type_id = this.tundukData.categorySystemId;
    this.customer.ugns = this.tundukData.statSubCode;
    this.customer.registration_number = this.tundukData.registrCode;
    this.customer.sms_1 = phones[0] || "";
    this.customer.sms_2 = phones[1] || "";
    this.customer.email_1 = this.tundukData.email1;
    this.customer.email_2 = this.tundukData.email2;
    this.isOpenTundukData = false;
  }

  retryTunduk() {
    this.isTundukError = false;
    this.findCompanyByPin(this.customer.pin);
  }

  continueWithoutTunduk() {
    this.isTundukError = false;
  }
}

export default new NewStore();
