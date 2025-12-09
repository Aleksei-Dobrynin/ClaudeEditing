import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getService } from "api/Service/useGetService";
import { createService } from "api/Service/useCreateService";
import { updateService } from "api/Service/useUpdateService";
import { getWorkflows } from "../../../api/Workflow/useGetWorkflows";
import dayjs, { Dayjs } from "dayjs";
import { getLawDocuments } from "../../../api/LawDocument";
import { getStructures } from "api/Structure/useGetStructures";

class NewStore {
  id = 0;
  name = "";
  short_name = "";
  code = "";
  description = "";
  day_count = 0;
  price = 0;
  workflow_id = 0;
  law_document_id = 0;
  structure_id = 0;
  workflow_name = "";
  is_active = false;
  date_start = null;
  date_end = null;
  errorname = "";
  errorshort_name = "";
  errorcode = "";
  errordescription = "";
  errorday_count = "";
  errorprice = "";
  errorworkflow_id = "";
  errorworkflow_name = "";
  errordate_start = "";
  errordate_end = "";
  errorlaw_document_id = "";
  errorstructure_id = "";
  Workflows = [];
  LawDocuments = [];
  Structures = [];

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.name = "";
      this.short_name = "";
      this.code = "";
      this.description = "";
      this.day_count = 0;
      this.price = 0;
      this.workflow_id = 0;
      this.law_document_id = 0;
      this.structure_id = 0;
      this.workflow_name = "";
      this.is_active = false;
      this.date_start = null;
      this.date_end = null;
      this.errorname = "";
      this.errorshort_name = "";
      this.errorcode = "";
      this.errordescription = "";
      this.errorday_count = "";
      this.errorprice = "";
      this.errorworkflow_id = "";
      this.errorworkflow_name = "";
      this.errordate_start = "";
      this.errordate_end = "";
      this.errorstructure_id = "";
      this.Workflows = [];
      this.LawDocuments = [];
      this.Structures = [];
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
    event = { target: { name: "name", value: this.name } };
    canSave = validate(event) && canSave;
    event = { target: { name: "description", value: this.description } };
    canSave = validate(event) && canSave;
    event = { target: { name: "code", value: this.code } };
    canSave = validate(event) && canSave;
    event = { target: { name: "day_count", value: this.day_count } };
    canSave = validate(event) && canSave;
    event = { target: { name: "price", value: this.price } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          name: this.name,
          short_name: this.short_name,
          code: this.code,
          description: this.description,
          day_count: this.day_count,
          price: this.price,
          workflow_id: this.workflow_id,
          is_active: this.is_active,
          date_start: MainStore.formatDate(this.date_start),
          date_end: MainStore.formatDate(this.date_end),
          law_document_id: this.law_document_id,
          structure_id: this.structure_id
        };

        const response = data.id === 0
          ? await createService(data)
          : await updateService(data);

          if (response.status === 201 || response.status === 200) {
            onSaved(response);
            console.log(i18n.language)
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

  loadWorkflows = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getWorkflows();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Workflows = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

    loadStructures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getStructures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Structures = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadService = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getService(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.id = response.data.id;
          this.name = response.data.name;
          this.short_name = response.data.short_name;
          this.code = response.data.code;
          this.description = response.data.description;
          this.day_count = response.data.day_count;
          this.price = response.data.price;
          this.workflow_id = response.data.workflow_id;
          this.is_active = response.data.is_active;
          this.date_start = dayjs(response.data.date_start);
          this.date_end = dayjs(response.data.date_end);
          this.law_document_id = response.law_document_id;
          this.structure_id = response.data.structure_id;
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

  loadLawDocuments = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getLawDocuments();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.LawDocuments = response.data;
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
    this.loadWorkflows()
    this.loadLawDocuments()
    this.loadStructures()
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadService(id);
  }
}

export default new NewStore();
