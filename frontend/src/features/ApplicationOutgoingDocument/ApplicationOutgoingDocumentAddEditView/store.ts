import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getApplicationOutgoingDocument, createApplicationOutgoingDocument, updateApplicationOutgoingDocument } from "api/ApplicationOutgoingDocument";

class NewStore {
  id = 0;
  application_id = 0;
  outgoing_number = "";
  issued_to_customer = false;
  issued_at = null;
  signed_ecp = false;
  signature_data = "";
  journal_id = 0;
  errorapplication_id = "";
  erroroutgoing_number = "";
  errorissued_to_customer = "";
  errorissued_at = "";
  errorsigned_ecp = "";
  errorsignature_data = "";
  errorjournal_id = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.application_id = 0;
      this.outgoing_number = "";
      this.issued_to_customer = false;
      this.issued_at = null;
      this.signed_ecp = false;
      this.signature_data = "";
      this.journal_id = 0;
      this.errorapplication_id = "";
      this.erroroutgoing_number = "";
      this.errorissued_to_customer = "";
      this.errorissued_at = "";
      this.errorsigned_ecp = "";
      this.errorsignature_data = "";
      this.errorjournal_id = "";
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

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          application_id: this.application_id,
          outgoing_number: this.outgoing_number,
          issued_to_customer: this.issued_to_customer,
          issued_at: this.issued_at,
          signed_ecp: this.signed_ecp,
          signature_data: this.signature_data,
          journal_id: this.journal_id,
        };

        const response = data.id === 0
          ? await createApplicationOutgoingDocument(data)
          : await updateApplicationOutgoingDocument(data);

          if (response.status === 201 || response.status === 200) {
            onSaved(response);
            console.log(i18n.language)
            if (data.id === 0) {
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

  loadApplicationOutgoingDocument = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationOutgoingDocument(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.application_id = response.data.application_id;
          this.outgoing_number = response.data.outgoing_number;
          this.issued_to_customer = response.data.issued_to_customer;
          this.issued_at = response.data.issued_at;
          this.signed_ecp = response.data.signed_ecp;
          this.signature_data = response.data.signature_data;
          this.journal_id = response.data.journal_id;
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

  async doLoad(id: number) {
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadApplicationOutgoingDocument(id);
  }
}

export default new NewStore();
