import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getApplication } from "api/Application/useGetApplication";
import ApplicationCommentsStore from "../../ApplicationComments/ApplicationCommentsListView/store";
import { getCustomer } from "api/Customer/useGetCustomer";
import { Customer } from "constants/Customer";
import dayjs from "dayjs";
import { ArchObjectValues } from "constants/ArchObject";
import { getArchObjectsByAppId } from "api/ArchObject/useGetArchObjects";
import { getTags } from "api/Tag/useGetTags";
import { changeApplicationStatus } from "api/Application/useCreateApplication";
import { ErrorResponseCode, SelectOrgStructureForWorklofw, APPLICATION_STATUSES, ContactTypes } from "constants/constant";
import { getApplicationStatuss } from "api/ApplicationStatus/useGetApplicationStatuses";
import { getApplicationRoads } from "../../../api/ApplicationRoad/useGetApplicationRoads";

class NewStore {
  id = 0;
  registration_date = null;
  updated_at = null;
  customer_id = 0;
  arch_object_id = 0;
  arch_object_district = "";
  status_id = 0;
  status_code = "";
  status_color = "";
  status_name = "";
  service_id = 0;
  service_name = 0;
  deadline = null;
  comment = "";
  is_paid = false;
  number = "";
  created_by_name = "";
  created_at = null;
  work_description = "";
  incoming_numbers = "";
  outgoing_numbers = "";
  object_tag_id = 0;
  arch_process_id = 0;

  xcoordinate = 0;
  ycoordinate = 0;
  description = "";
  geometry = [];
  point = [];
  Districts = [];
  Statuses = [];
  ApplicationRoads = [];
  Tags = [];
  tags = [];
  arch_objects: ArchObjectValues[] = [];
  counts: number[] = [];
  loading = [false];
  legalRecords = false;
  openStatusHistoryPanel = false;

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

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.registration_date = null;
      this.updated_at = null;
      this.customer_id = 0;
      this.arch_object_id = 0;
      this.status_id = 0;
      this.status_code = "";
      this.service_id = 0;
      this.deadline = null;
      this.comment = null;
      this.is_paid = false;
      this.number = "";
      this.created_by_name = "";
      this.created_at = null;
      this.work_description = "";
      this.incoming_numbers = "";
      this.outgoing_numbers = "";
      this.object_tag_id = 0;
      this.openStatusHistoryPanel = false;
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
  }

  loadApplication = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplication(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.registration_date = response.data.registration_date;
          this.updated_at = response.data.updated_at;
          this.customer_id = response.data.customer_id;
          this.status_id = response.data.status_id;
          this.status_code = response.data.status_code;
          this.status_name = response.data.status_name;
          this.status_color = response.data.status_color;
          this.service_id = response.data.service_id;
          this.service_name = response.data.service_name;
          this.arch_object_district = response.data.arch_object_district;
          this.deadline = response.data.deadline;
          this.comment = response.data.comment;
          this.arch_object_id = response.data.arch_object_id;
          this.is_paid = response.data.is_paid;
          this.number = response.data.number;
          this.created_by_name = response.data.created_by_name;
          this.created_at = response.data.created_at;
          this.work_description = response.data?.work_description;
          this.object_tag_id = response.data?.object_tag_id;
          this.incoming_numbers = response.data?.incoming_numbers;
          this.outgoing_numbers = response.data?.outgoing_numbers;
          this.arch_process_id = response.data?.arch_process_id;
        });
        
        // ИСПРАВЛЕНИЕ 1: Добавили await и отдельную обработку ошибок для loadCustomer
        try {
          await this.loadCustomer(this.customer_id);
        } catch (customerError) {
          console.error("Error loading customer:", customerError);
          // Не показываем ошибку пользователю, так как основные данные загружены успешно
        }
        
        ApplicationCommentsStore.setApplicationId(response.data.id);
      } else {
        throw new Error("Invalid response status or empty data");
      }
    } catch (err) {
      console.error("Error in loadApplication:", err);
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

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
      document_date_issue: dayjs(data.document_date_issue)?.toISOString(),
      document_whom_issued: data.document_whom_issued,
      customerRepresentatives: data.customerRepresentatives,
      is_foreign: data.is_foreign,
      foreign_country: data.foreign_country,
    };
    if (!data.document_serie) {
      this.customer.document_serie = "ID AN ";
    }
    if (!data.document_whom_issued) {
      this.customer.document_whom_issued = "МКК ";
    }
  };

  loadCustomer = async (customer_id: number) => {
    try {
      const response = await getCustomer(customer_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.setCustomerData(response.data);
      } else {
        throw new Error("Invalid customer response");
      }
    } catch (err) {
      console.error("Error in loadCustomer:", err);
      // Перебрасываем ошибку для обработки в вызывающем методе
      throw err;
    }
  };

  loadArchObjects = async (app_id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchObjectsByAppId(app_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        // ИСПРАВЛЕНИЕ 2: Убрали async из runInAction
        runInAction(() => {
          this.arch_objects = response.data;
          this.tags = response.data[0]?.tags;
          this.description = response.data[0]?.description;
        });
      } else {
        throw new Error("Invalid arch objects response");
      }
    } catch (err) {
      console.error("Error in loadArchObjects:", err);
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadTags = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getTags();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Tags = response.data;
        });
      } else {
        throw new Error("Invalid tags response");
      }
    } catch (err) {
      console.error("Error in loadTags:", err);
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  // ИСПРАВЛЕНИЕ 3: Добавили правильную обработку асинхронных вызовов
  async doLoad(id: number) {
    this.id = id;
    if (id == null || id == 0) {
      return;
    }

    // Загружаем теги независимо от других данных
    this.loadTags().catch(err => {
      console.error("Error loading tags:", err);
    });

    try {
      // Основные данные загружаем последовательно
      await this.loadApplication(id);
      await this.loadArchObjects(id);
      
      // Эти данные можно загружать параллельно
      await Promise.allSettled([
        this.loadStatuses(),
        this.loadApplicationRoads()
      ]);
    } catch (err) {
      console.error("Error in doLoad:", err);
      // Не показываем дополнительное сообщение, так как каждый метод уже обрабатывает свои ошибки
    }
  }

  async changeToStatus(id: number) {
    try {
      MainStore.changeLoader(true);
      const response = await changeApplicationStatus(this.id, id);
      if (response && (response.status === 200 || response.status === 201)) {
        MainStore.setSnackbar(i18n.t("message:statusChanged"));
        this.status_id = id;
        // ИСПРАВЛЕНИЕ 4: Добавили await для корректной обработки
        await this.loadApplication(this.id);
      } else if (response?.response?.status === 422 && response?.response?.data?.errorType === ErrorResponseCode.MESSAGE) {
        const message = JSON.parse(response?.response?.data?.errorMessage);
        MainStore.openErrorDialog(message?.ru, "ОШИБКА!");
      } else {
        throw new Error("Invalid status change response");
      }
    } catch (err) {
      console.error("Error in changeToStatus:", err);
      const serverMessage = err?.message || i18n.t("message:somethingWentWrong");
      MainStore.setSnackbar(serverMessage, "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  changeApplicationHistoryPanel(bool: boolean) {
    runInAction(() => {
      this.openStatusHistoryPanel = bool;
    });
  }

  loadStatuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationStatuss();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Statuses = response.data.filter((x) => x.name);
      } else {
        throw new Error("Invalid statuses response");
      }
    } catch (err) {
      console.error("Error in loadStatuses:", err);
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
        throw new Error("Invalid application roads response");
      }
    } catch (err) {
      console.error("Error in loadApplicationRoads:", err);
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
}

export default new NewStore();