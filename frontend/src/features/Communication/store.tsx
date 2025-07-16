import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { getSmProject } from "api/SmProject";
import { createSmProject } from "api/SmProject";
import { updateSmProject } from "api/SmProject";
import dayjs from "dayjs";
import { getSmProjectTypes } from "api/SmProjectType";
import { getEntities } from "api/Entity";
import { getSmProjectFrequencies } from "api/SmProjectFrequency";
import { getEntityAttributes } from "api/EntityAttributes";
import { getSmProjectStatuses } from "api/SmProjectStatus";

class NewStore {
  id = 0;
  valueTab: number = 0;


  constructor() {
    makeAutoObservable(this);
  }

  clearStore() {
    runInAction(() => {
    });
  }

  handleTabSecondAccordionChange = (event: React.SyntheticEvent, newValue: number) => {
    this.valueTab = newValue;
  };

  async doLoad(id: number) {
    this.id = id

    // await this.loadEntityAttributes();

  }

  loadEntityAttributes = async () => {
    // try {
    //   MainStore.changeLoader(true);
    //   const response = await getEntityAttributes();
    //   if ((response.status === 201 || response.status === 200) && response?.data !== null) {
    //     this.EntityAttributes = response.data
    //   } else {
    //     throw new Error();
    //   }
    // } catch (err) {
    //   MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    // } finally {
    //   MainStore.changeLoader(false);
    // }
  };
}

export default new NewStore();
