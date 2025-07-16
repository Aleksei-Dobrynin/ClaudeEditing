import { makeAutoObservable, runInAction, toJS } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getApplication } from "api/Application/useGetApplication";
import { changeApplicationStatus, createApplication } from "api/Application/useCreateApplication";
import { updateApplication } from "api/Application/useUpdateApplication";
import { getCustomers } from "api/Customer/useGetCustomers";
import { getCustomer } from "api/Customer/useGetCustomer";
import { getArchObjects, getArchObjectsByAppId } from "../../../api/ArchObject/useGetArchObjects";
import { getServices } from "../../../api/Service/useGetServices";
import { getDistricts } from "../../../api/District/useGetDistricts";
import { getArchObjectTag } from "../../../api/ArchObject/useGetArchObjectTag";
import commentStore from "../../ApplicationComments/ApplicationCommentsListView/store";
import { getApplicationStatuss } from "api/ApplicationStatus/useGetApplicationStatuses";
import ApplicationCommentsStore from "../../ApplicationComments/ApplicationCommentsListView/store";
import { ErrorResponseCode } from "constants/constant";
import { getArchObject } from "../../../api/ArchObject/useGetArchObject";
import { ArchObject } from "constants/ArchObject";

class NewStore {
  id = 0;
  registration_date = null;
  updated_at = null;
  customer_id = 0;
  arch_object_id = 0;
  status_id = 0;
  workflow_id = 0;
  service_id = 0;
  district_id = 0;
  deadline = null;
  comment = "";
  is_paid = false;
  number = "";
  created_by_name = "";
  created_at = null;
  work_description = "";
  errorregistration_date = "";
  errorcustomer_id = "";
  errorarch_object_id = "";
  errorstatus_id = "";
  errorworkflow_id = "";
  errorservice_id = "";
  errordeadline = "";
  errorcomment = "";
  errordistrict_id = "";
  openCustomerPanel = false;
  openArchObjectPanel = false;
  openCustomerRepresentativePanel = false;
  Customer = null;
  ArchObject = null;
  ArchObjects: ArchObject[] = [];
  Services = [];
  Districts = [];
  Statuses = [];
  ArchObjectTag = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      // this.registration_date = null;
      // this.updated_at = null;
      // this.customer_id = 0;
      // this.arch_object_id = 0;
      // this.status_id = 0;
      // this.workflow_id = 0;
      // this.service_id = 0;
      // this.deadline = null;
      // this.comment = null;
      // this.is_paid = false;
      // this.number = "";
      // this.created_by_name = "";
      // this.created_at = null;
      // this.errorregistration_date = "";
      // this.errorcustomer_id = "";
      // this.errorarch_object_id = "";
      // this.errorstatus_id = "";
      // this.errorworkflow_id = "";
      // this.errorservice_id = "";
      // this.errordeadline = "";
      // this.errorcomment = "";
      // this.openCustomerPanel = false;
      // this.openArchObjectPanel = false;
      // this.openCustomerRepresentativePanel = false;
    });
  }

  loadServices = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getServices();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Services = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadDistricts = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDistricts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Districts = response.data;
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
        this.Statuses = response.data.filter(x=>x.name);
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadCustomer = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getCustomer(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Customer = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadArchObjects = async (app_id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchObjectsByAppId(app_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ArchObjects = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  // loadArchObjectsTag = async (id: number) => {
  //   try {
  //     MainStore.changeLoader(true);
  //     const response = await getArchObjectTag(id);
  //     if ((response.status === 201 || response.status === 200) && response?.data !== null) {
  //       this.ArchObjectTag = response.data;
  //     } else {
  //       throw new Error();
  //     }
  //   } catch (err) {
  //     MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
  //   } finally {
  //     MainStore.changeLoader(false);
  //   }
  // };


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
          this.workflow_id = response.data.workflow_id;
          this.service_id = response.data.service_id;
          this.deadline = response.data.deadline;
          this.comment = response.data.comment;
          this.arch_object_id = response.data.arch_object_id;
          this.is_paid = response.data.is_paid;
          this.number = response.data.number;
          this.created_by_name = response.data.created_by_name;
          this.created_at = response.data.created_at;
          this.work_description = response.data.work_description;
        });
        this.loadArchObjects(id)
        this.loadCustomer(response.data.customer_id);
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


  async doLoad(id: number) {
    // this.loadCustomers();
    this.loadServices();
    this.loadDistricts();
    this.loadStatuses();
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadApplication(id);
    // commentStore.loadAllComments(id);
  }
}

export default new NewStore();
