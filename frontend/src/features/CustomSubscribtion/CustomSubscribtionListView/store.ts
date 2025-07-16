import { makeAutoObservable, runInAction } from "mobx";
import MainStore from "../../../MainStore";
import i18n from "i18next";
import {
  getCustomSubscribtionAll,
  getCustomSubscribtionByIdEmployee
} from "../../../api/CustomSubscribtions/useGetCustomSubscribtions";
import { deleteCustomSubscribtion } from "../../../api/CustomSubscribtions/UseDeleteCustomSubscribtion";
import { CustomSubscribtion } from "../../../constants/CustomSubscribtion";
import { getcontact_types } from "../../../api/contact_type";
import { ContactType } from "../../../constants/ContactType";
import { getEmployeeByEmail } from "../../../api/Employee/useGetEmployeeByEmail";
import { getEmployeeByIdUser } from "../../../api/Employee/useGetEmployeeByUserId";

class NewStore {
  data: CustomSubscribtion[] = [];
  openPanel = false;
  currentId = 0;
  customer_id = 0;
  isEdit = false;
  contactTypes: ContactType[] = [];

  constructor() {
    makeAutoObservable(this);
  }
  loadCustomSubscribtion = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getCustomSubscribtionAll();
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

  loadCustomSubscribtionByIdEmployee = async () => {
    try {
      MainStore.changeLoader(true);
      const responseEmployee = await getEmployeeByEmail();
      const response = await getCustomSubscribtionByIdEmployee(responseEmployee.data.id);
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

  loadContactType = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getcontact_types();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.contactTypes = response.data;
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

  deleteCustomSubscribtion = (id: number) => {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteCustomSubscribtion(id);
          if (response.status === 201 || response.status === 200) {
            await this.loadCustomSubscribtion();
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
}


export default new NewStore();