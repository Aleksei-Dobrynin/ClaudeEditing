import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import { getServiceStatusNumbering, createServiceStatusNumbering, updateServiceStatusNumbering } from "api/ServiceStatusNumbering";
import { getDocumentJournalss } from "../../../api/DocumentJournals";
import { getServices } from "api/Service/useGetServices";
import dayjs from "dayjs";

class NewStore {
  id = 0;
  date_start = null;
  date_end = null;
  is_active = false;
  service_id = 0;
  journal_id = 0;
  number_template = "";
  Services = [];
  errordate_start = "";
  errordate_end = "";
  erroris_active = "";
  errorservice_id = "";
  errorjournal_id = "";
  errornumber_template = "";

  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.date_start = null;
      this.date_end = null;
      this.is_active = false;
      this.service_id = 0;
      this.journal_id = 0;
      this.number_template = "";
      this.Services = [];
      this.errordate_start = "";
      this.errordate_end = "";
      this.erroris_active = "";
      this.errorservice_id = "";
      this.errorjournal_id = "";
      this.errornumber_template = "";
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
          date_start: this.date_start,
          date_end: this.date_end,
          is_active: this.is_active,
          service_id: this.service_id,
          journal_id: this.journal_id,
          number_template: this.number_template,
        };

        if (data.date_start != null) {
          const offset = dayjs(data.date_start).utcOffset();
          data.date_start = dayjs(data.date_start).add(offset, 'minute').toISOString();
        }
        if (data.date_end != null) {
          const offset = dayjs(data.date_end).utcOffset();
          data.date_end = dayjs(data.date_end).add(offset, 'minute').toISOString();
        }


        const response = data.id === 0
          ? await createServiceStatusNumbering(data)
          : await updateServiceStatusNumbering(data);

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

  // loadDocumentJournalss = async () => {
  //   try {
  //     MainStore.changeLoader(true);
  //     const response = await getDocumentJournalss();
  //     if ((response.status === 201 || response.status === 200) && response?.data !== null) {
  //       this.Journals = response.data;
  //     } else {
  //       throw new Error();
  //     }
  //   } catch (err) {
  //     MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
  //   } finally {
  //     MainStore.changeLoader(false);
  //   }
  // };

  loadServices = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getServices();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Services = response.data.filter(x => x.is_active === true);
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadServiceStatusNumbering = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getServiceStatusNumbering(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.date_start = dayjs(response.data.date_start);
          this.date_end = dayjs(response.data.date_end);
          this.is_active = response.data.is_active;
          this.service_id = response.data.service_id;
          this.journal_id = response.data.journal_id;
          this.number_template = response.data.number_template;
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
    this.loadServiceStatusNumbering(id);
  }
}

export default new NewStore();
