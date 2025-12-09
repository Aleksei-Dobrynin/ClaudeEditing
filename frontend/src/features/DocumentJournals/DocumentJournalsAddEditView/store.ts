import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  getDocumentJournals,
  createDocumentJournals,
  updateDocumentJournals,
  getPeriodTypes
} from "api/DocumentJournals";
import dayjs from "dayjs";
import { getJournalTemplateTypes } from "../../../api/JournalTemplateType";
import { getApplicationStatuss } from "api/ApplicationStatus/useGetApplicationStatuses";

class NewStore {
  id = 0;
  code = "";
  name = "";
  number_template = "";
  current_number = 0;
  reset_period = "";
  last_reset = null;

  Statuses = []
  statuses = []

  Templates = [];
  PeriodTypes = [];
  selected = [];
  exampleValue = '';
  period_type_id = 0;
  errorcode = "";
  errorname = "";
  errornumber_template = "";
  errorcurrent_number = "";
  errorreset_period = "";
  errorlast_reset = "";
  errorperiod_type_id = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.code = "";
      this.name = "";
      this.number_template = "";
      this.current_number = 0;
      this.reset_period = "";
      this.last_reset = null;
      this.Templates = [];
      this.statuses = [];
      this.Statuses = [];
      this.PeriodTypes = [];
      this.selected = [];
      this.exampleValue = '';
      this.period_type_id = 0;
      this.errorcode = "";
      this.errorname = "";
      this.errornumber_template = "";
      this.errorcurrent_number = "";
      this.errorreset_period = "";
      this.errorlast_reset = "";
      this.errorperiod_type_id = "";
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  changeStatuses(ids: number[]) {
    this.statuses = ids;
  }

  onSaveClick = async (onSaved: (id: number) => void) => {
    let canSave = true;
    let event: { target: { name: string; value: any } } = {
      target: { name: "id", value: this.id },
    };
    canSave = validate(event) && canSave;
    event = { target: { name: "name", value: this.name } };
    canSave = validate(event) && canSave;
    event = { target: { name: "code", value: this.code } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: this.id,
          code: this.code,
          name: this.name,
          number_template: this.number_template,
          current_number: this.current_number,
          reset_period: this.reset_period,
          last_reset: this.last_reset,
          template_types: this.selected.map((tpl, i) => ({ id: tpl.id, order: i })),
          period_type_id: this.period_type_id,
          status_ids: this.statuses
        };

        const response = data.id === 0
          ? await createDocumentJournals(data)
          : await updateDocumentJournals(data);

        if (response.status === 201 || response.status === 200) {
          onSaved(response.data.id);
          this.id = response.data.id;
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


  loadStatuses = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationStatuss();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Statuses = response.data
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


  loadDocumentJournals = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getDocumentJournals(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.statuses = response.data.status_ids;
          this.code = response.data.code;
          this.name = response.data.name;
          this.number_template = response.data.number_template;
          this.current_number = response.data.current_number;
          this.reset_period = response.data.reset_period;
          this.last_reset = dayjs(response.data.last_reset);
          this.selected = response.data.template_types
            .sort((a, b) => a.order - b.order)
            .map((t) => this.Templates.find((p) => p.id === t.id)!)
            .filter(Boolean);
          this.exampleValue = this.selected.map(t => t.example).join("");
          this.period_type_id = response.data.period_type_id;
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

  toggleTemplate = (id: number) => {
    const tpl = this.Templates.find(t => t.id === id);
    if (tpl) {
      this.selected.push(tpl);
      this.exampleValue = this.selected.map((t) => t.example).join("");
    }
  };

  removeTemplate = (idx: number) => {
    this.selected.splice(idx, 1);
    this.exampleValue = this.selected.map(t => t.example).join("");
  };

  loadJournalTemplateTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getJournalTemplateTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Templates = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadPeriodTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getPeriodTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.PeriodTypes = response.data;
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
    await this.loadJournalTemplateTypes()
    await this.loadPeriodTypes()
    await this.loadStatuses()
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadDocumentJournals(id);
  }
}

export default new NewStore();
