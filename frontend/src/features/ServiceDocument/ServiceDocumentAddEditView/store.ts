import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getServiceDocument } from "api/ServiceDocument/useGetServiceDocument";
import { createServiceDocument } from "api/ServiceDocument/useCreateServiceDocument";
import { updateServiceDocument } from "api/ServiceDocument/useUpdateServiceDocument";
import { getApplicationDocuments } from "../../../api/ApplicationDocument/useGetApplicationDocuments";

class NewStore {
  id = 0;
  application_document_id = 0;
  idService = 0;
  service_id = 0;
  is_required = false;
  errorapplication_document_id = "";
  erroris_required = "";
  ApplicationDocuments = []

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.application_document_id = 0;
      this.idService = 0;
      this.service_id = 0;
      this.is_required = false;
      this.errorapplication_document_id = "";
      this.erroris_required = "";
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
    event = { target: { name: "application_document_id", value: this.application_document_id } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          service_id: this.idService,
          application_document_id: this.application_document_id,
          is_required: this.is_required
        };

        const response = data.id === 0
          ? await createServiceDocument(data)
          : await updateServiceDocument(data);

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

  loadServiceDocument = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getServiceDocument(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.service_id = response.data.service_id;
            this.application_document_id = response.data.application_document_id;
            this.is_required = response.data.is_required;        });
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadApplicationDocuments = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationDocuments();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ApplicationDocuments = response.data;
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
    this.loadApplicationDocuments()
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadServiceDocument(id);
  }
}

export default new NewStore();
