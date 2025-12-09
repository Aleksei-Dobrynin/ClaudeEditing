import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  getTechCouncils,
  deleteTechCouncil,
  getTechCouncilsByApplicationId,
  getGetTable,
  getGetTableWithOutSession, getGetTableBySession, updateSessionTechCouncil, updateSessionTechCouncilOneCase
} from "api/TechCouncil";
import { getFilledTemplateByCode, getMyOrgStructures } from "../../../api/org_structure";
import printJS from "print-js";
import { validate } from "../../Customer/CustomerAddEditView/valid";
import { createDistrict } from "../../../api/District/useCreateDistrict";
import { updateDistrict } from "../../../api/District/useUpdateDistrict";

class NewStore {
  data = [];
  TechCouncils = [];
  openPanel = false;
  application_id = 0;
  currentId = 0;
  idMain = 0;
  search = "";
  selectedApplicationCase = [];

  constructor() {
    makeAutoObservable(this);
  }

  onEditClicked(id: number) {
    runInAction(() => {
      this.openPanel = true;
      this.currentId = id;
    });
  }

  closePanel() {
    runInAction(() => {
      this.openPanel = false;
      this.currentId = 0;
    });
  }

  onPrintSelectedApplication(application_ids: number[]) {
    console.log(application_ids);
    MainStore.printDocumentByCode("tech_council_sheet", {
      applicationids: application_ids
    });
  }

  filterData = () => {
    if (this.search.trim() === "") {
      return this.data;
    }

    return this.data.filter((item) =>
      item.application_number.toLowerCase().includes(this.search.toLowerCase())
    );
  };

  loadTechCouncils = async (session_id: number) => {
    try {
      if (session_id == null) return;
      MainStore.changeLoader(true);
      const response = await getGetTableBySession(session_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadTechCouncilsList = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getGetTableWithOutSession();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.TechCouncils = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  onPrintCommentSheet(application_id: number) {
    MainStore.printDocumentByCode("object_comment_sheet", {
      application_id: application_id
    });
  }

  onSaveClick = async (onSaved: (id: number) => void) => {
    try {
      MainStore.changeLoader(true);
      var data = {
        session_id: this.idMain,
        application_ids: this.selectedApplicationCase
      };
      const response = await updateSessionTechCouncil(data);
      if (response.status === 201 || response.status === 200) {
        onSaved(response);
        MainStore.setSnackbar(i18n.t("message:snackbar.successEdit"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  deleteTechCouncil = (id: number, idMain: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          var data = {
            session_id: null,
            application_id: id
          };
          const response = await updateSessionTechCouncilOneCase(data);
          if (response.status === 201 || response.status === 200) {
            this.loadTechCouncils(idMain);
            MainStore.setSnackbar(i18n.t("message:snackbar.successDelete"));
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
  };

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  clearStore = () => {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.idMain = 0;
      this.openPanel = false;
      this.application_id = 0;
    });
  };
}

export default new NewStore();