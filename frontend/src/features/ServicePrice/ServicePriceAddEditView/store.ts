import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  getServicePrice,
  createServicePrice,
  updateServicePrice,
  getGetServiceAll,
  getGetServiceAllByService, getGetServiceByStructureByService
} from "api/ServicePrice";
import { getStructures } from "../../../api/Structure/useGetStructures";
import { getServices } from "../../../api/Service/useGetServices";
import { getS_DocumentTemplates, getS_DocumentTemplatesByDefaultCalcType } from "../../../api/S_DocumentTemplate";
import { getS_DocumentTemplateTranslationsByidDocumentTemplate } from "../../../api/S_DocumentTemplateTranslation";

class NewStore {
  id = 0;
  service_id = 0;
  structure_id = 0;
  document_template_id = 0;
  price = 0;
  errorservice_id = "";
  errorstructure_id = "";
  errordocument_template_id = "";
  errorprice = "";
  Service = [];
  Structure = [];
  Templates = [];
  Translates = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.service_id = 0;
      this.structure_id = 0;
      this.document_template_id = 0;
      this.price = 0;
      this.errorservice_id = "";
      this.errorstructure_id = "";
      this.errordocument_template_id = "";
      this.errorprice = "";
      this.Service = [];
      this.Structure = [];
      this.Templates = [];
      this.Translates = [];
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  languageChanged(translates: any[]){
    this.Translates = translates
  }

  onSaveClick = async (onSaved: (id: number) => void) => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id },
    };
    event = { target: { name: "price", value: this.price } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          service_id: this.service_id,
          structure_id: this.structure_id,
          document_template_id: this.document_template_id,
          price: this.price,
        };

        const response = data.id === 0
          ? await createServicePrice(data)
          : await updateServicePrice(data);

          if (response.status === 201 || response.status === 200) {
            onSaved(response);
            console.log(i18n.language)
            if (data.id === 0) {
              this.id = response.data.id;
              MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
            } else {
              MainStore.setSnackbar(i18n.t("message:snackbar.successEdit"), "success");
            }
          } else if (response.response.status === 409) {
            MainStore.setSnackbar(i18n.t(`message:error.${response.response.data.message}`), "error");
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

  loadStructures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getStructures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Structure = response.data;
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
      if (MainStore.isHeadStructure){
        return;
      }
      MainStore.changeLoader(true);
      const response = this.service_id && this.service_id != 0
        ? await getGetServiceAllByService(this.service_id)
        : await getGetServiceAll();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Service = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadServicesByStructure = async (structure_id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = this.service_id && this.service_id != 0
        ? await getGetServiceByStructureByService(structure_id, this.service_id)
        : await getGetServiceByStructureByService(structure_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Service = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadServicePrice = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getServicePrice(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.service_id = response.data.service_id;
          this.structure_id = response.data.structure_id;
          this.document_template_id = response.data.document_template_id;
          this.price = response.data.price;
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

  loadS_DocumentTemplates = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getS_DocumentTemplatesByDefaultCalcType();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Templates = response.data
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
    this.loadServices()
    this.loadStructures()
    this.loadS_DocumentTemplates()
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    await this.loadServicePrice(id);
    await this.loadServices()
  }
}

export default new NewStore();
