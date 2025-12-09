import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getCustomer } from "api/Customer/useGetCustomer";
import { createCustomer } from "api/Customer/useCreateCustomer";
import { updateCustomer } from "api/Customer/useUpdateCustomer";
import { getSmProjectTypes } from "../../../api/SmProjectType";
import { getorganization_types } from "api/organization_type";
import { getInfoByPin } from "api/Customer/useGetInfoByPin";
import { getOneByPin } from "../../../api/Customer/useGetCustumerByPin";
import { getidentity_document_types } from "api/identity_document_type";
import dayjs from "dayjs";

class NewStore {
  id = 0;
  pin = "";
  is_organization = false;
  full_name = "";
  address = "";
  director = "";
  okpo = "";
  organization_type_id = 0;
  payment_account = "";
  postal_code = "";
  ugns = "";
  bank = "";
  bik = "";
  registration_number = "";
  individual_name = "";
  individual_secondname = "";
  individual_surname = "";
  identity_document_type_id = 0;
  document_serie = "ID";
  document_date_issue = null;
  document_whom_issued = "";
  sms_1 = "";
  sms_2 = "";
  email_1 = "";
  email_2 = "";
  telegram_1 = "";
  telegram_2 = "";
  errorpin = "";
  erroris_organization = "";
  errorfull_name = "";
  erroraddress = "";
  errordirector = "";
  errorokpo = "";
  errororganization_type_id = "";
  errorpayment_account = "";
  errorpostal_code = "";
  errorugns = "";
  errorbank = "";
  errorbik = "";
  errorregistration_number = "";
  errorindividual_name = "";
  errorindividual_secondname = "";
  errorindividual_surname = "";
  erroridentity_document_type_id = "";
  errordocument_serie = "";
  errordocument_date_issue = "";
  errordocument_whom_issued = "";
  errorsms_1 = "";
  errorsms_2 = "";
  erroremail_1 = "";
  erroremail_2 = "";
  errortelegram_1 = "";
  errortelegram_2 = "";

  DocumentTypes = [];
  OrganizationTypes = [];
  Identity_document_types = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.pin = "";
      this.is_organization = false;
      this.full_name = "";
      this.address = "";
      this.director = "";
      this.okpo = "";
      this.organization_type_id = 0;
      this.payment_account = "";
      this.postal_code = "";
      this.ugns = "";
      this.bank = "";
      this.bik = "";
      this.registration_number = "";
      this.sms_1 = "";
      this.sms_2 = "";
      this.email_1 = "";
      this.email_2 = "";
      this.telegram_1 = "";
      this.telegram_2 = "";
      this.errorpin = "";
      this.erroris_organization = "";
      this.errorfull_name = "";
      this.erroraddress = "";
      this.errordirector = "";
      this.errorokpo = "";
      this.errororganization_type_id = "";
      this.errorpayment_account = "";
      this.errorpostal_code = "";
      this.errorugns = "";
      this.errorbank = "";
      this.errorbik = "";
      this.errorregistration_number = "";
      this.individual_name = "";
      this.individual_secondname = "";
      this.individual_surname = "";
      this.identity_document_type_id = 0;
      this.document_serie = "ID";
      this.document_date_issue = null;
      this.document_whom_issued = "";
      this.errorindividual_name = "";
      this.errorindividual_secondname = "";
      this.errorindividual_surname = "";
      this.erroridentity_document_type_id = "";
      this.errordocument_serie = "";
      this.errordocument_date_issue = "";
      this.errordocument_whom_issued = "";
      this.errorsms_1 = "";
      this.errorsms_2 = "";
      this.erroremail_1 = "";
      this.erroremail_2 = "";
      this.errortelegram_1 = "";
      this.errortelegram_2 = "";
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  onSaveClick = async (onSaved: (id: number) => void) => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id },
    };
    canSave = validate(event) && canSave;
    event = { target: { name: "pin", value: this.pin } };
    canSave = validate(event) && canSave;
    event = { target: { name: "is_organization", value: this.is_organization } };
    canSave = validate(event) && canSave;
    event = { target: { name: "full_name", value: this.full_name } };
    canSave = validate(event) && canSave;
    event = { target: { name: "address", value: this.address } };
    canSave = validate(event) && canSave;
    event = { target: { name: "director", value: this.director } };
    canSave = validate(event) && canSave;
    event = { target: { name: "okpo", value: this.okpo } };
    canSave = validate(event) && canSave;
    event = { target: { name: "organization_type_id", value: this.organization_type_id } };
    canSave = validate(event) && canSave;
    event = { target: { name: "pinCheckDuplicate", value: this.pin } };
    canSave = (await validate(event)) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          pin: this.pin,
          is_organization: this.is_organization,
          full_name: this.full_name,
          address: this.address,
          director: this.director,
          okpo: this.okpo,
          organization_type_id: this.organization_type_id - 0,
          payment_account: this.payment_account,
          postal_code: this.postal_code,
          ugns: this.ugns,
          bank: this.bank,
          bik: this.bik,
          registration_number: this.registration_number,
          individual_name : this.individual_name,
          individual_secondname : this.individual_secondname,
          individual_surname : this.individual_surname,
          identity_document_type_id : this.identity_document_type_id,
          document_serie : this.document_serie,
          document_date_issue : this.document_date_issue,
          document_whom_issued : this.document_whom_issued,
          sms_1: this.sms_1,
          sms_2: this.sms_2,
          email_1: this.email_1,
          email_2: this.email_2,
          telegram_1: this.telegram_1,
          telegram_2: this.telegram_2,
          customerRepresentatives: [],
        };

        const response = data.id === 0 ? await createCustomer(data) : await updateCustomer(data);
        if (response.status === 201 || response.status === 200) {
          onSaved(response.data.id);
          console.log(i18n.language);
          if (data.id === 0) {
            this.id = response.data.id;
            MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
          } else {
            MainStore.setSnackbar(i18n.t("message:snackbar.successEdit"), "success");
          }
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

  loadCustomer = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getCustomer(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.pin = response.data.pin;
          this.is_organization = response.data.is_organization;
          this.full_name = response.data.full_name;
          this.address = response.data.address;
          this.director = response.data.director;
          this.okpo = response.data.okpo;
          this.postal_code = response.data.postal_code;
          this.ugns = response.data.ugns;
          this.bank = response.data.bank;
          this.bik = response.data.bik;
          this.payment_account = response.data.payment_account;
          this.registration_number = response.data.registration_number;
          this.organization_type_id = response.data.organization_type_id;
          this.individual_name = response.data.individual_name
          this.individual_secondname = response.data.individual_secondname
          this.individual_surname = response.data.individual_surname
          this.identity_document_type_id = response.data.identity_document_type_id;
          this.document_serie = response.data.document_serie
          this.document_date_issue = dayjs(response.data.document_date_issue);
          this.document_whom_issued = response.data.document_whom_issued
        });
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

  loadIdentity_document_types = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getidentity_document_types();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Identity_document_types = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  searchInfoByPin = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getInfoByPin(this.pin);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.is_organization = response.data.is_organization;
          this.full_name = response.data.full_name;
          this.address = response.data.address;
          this.director = response.data.director;
          this.okpo = response.data.okpo;
          this.organization_type_id = response.data.organization_type_id;
          MainStore.setSnackbar(i18n.t("message:snackbar.searchSuccess"), "success");
        });
      } else if (response.status === 204) {
        MainStore.setSnackbar(i18n.t("message:snackbar.searchNotFound"), "error");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:snackbar.searchError"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  searchByPin = async (pin: string): Promise<boolean> => {
    try {
      // MainStore.changeLoader(true);
      const response = await getOneByPin(pin, this.id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async doLoad(id: number) {
    this.loadorganization_types();
    this.loadIdentity_document_types();

    if (id == null || id == 0) {
      return;
    }

    this.id = id;
    this.loadCustomer(id);
  }
}

export default new NewStore();
