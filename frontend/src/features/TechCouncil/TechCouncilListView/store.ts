import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  getTechCouncils,
  deleteTechCouncil,
  getTechCouncilsByApplicationId,
  getGetTable,
  getGetTableByStructure
} from "api/TechCouncil";
import { getFilledTemplateByCode, getMyOrgStructures } from "../../../api/org_structure";
import printJS from "print-js";

class NewStore {
  data = [];
  openPanel = false;
  currentId = 0;
  idMain = 0;
  search = "";

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

  filterData = () => {
    if (this.search.trim() === "") {
      return this.data;
    }

    return this.data.filter((item) =>
      item.application_number.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  loadTechCouncils = async () => {
    try {
      MainStore.changeLoader(true);
      const userStructures = await getMyOrgStructures();
      if (userStructures.status != 200) {
        throw new Error();
      }
      let first_structure_id = userStructures.data[0]?.id;
      const response = await getGetTableByStructure(first_structure_id);
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

  onPrintCommentSheet(application_id: number) {
    MainStore.printDocumentByCode("object_comment_sheet", {
      application_id: application_id
    });
  }

  onPrintSelectedApplication(application_ids: number[]) {
    console.log(application_ids);
    MainStore.printDocumentByCode("tech_council_sheet", {
      applicationids: application_ids
    });
  }

  deleteTechCouncil = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteTechCouncil(id);
          if (response.status === 201 || response.status === 200) {
            this.loadTechCouncils();
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

  clearStore = () => {
    runInAction(() => {
      this.data = [];
      this.currentId = 0;
      this.idMain = 0;
      this.openPanel = false;
    });
  };
}

export default new NewStore();