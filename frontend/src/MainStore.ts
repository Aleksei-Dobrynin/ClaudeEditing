import { SnackbarOrigin } from "@mui/material";
import { getMyRoles } from "api/Auth/useAuth";
import { getFilledTemplate, getFilledTemplateByCode } from "api/org_structure";
import { RoleCode, RoleMenu, RoleMenuHeader } from "constants/constant";
import i18n from "i18n";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import printJS from "print-js";
import pages, { icons } from "./menu-items/pages";
import { getCountMyStructure } from "./api/TechCouncil";
import TechCouncilSection from "./layouts/MainLayout/Header/TechCouncilSection";
import { getCountApplicationsFromCabinet } from "api/Application/useGetApplications";
import dayjs, { Dayjs } from "dayjs";

class NewStore {
  loader_counter = 0;
  loader = false;
  openSnackbar = false;
  positionSnackbar: SnackbarOrigin = { vertical: "bottom", horizontal: "center" };
  snackbarMessage = "";
  snackbarSeverity: "success" | "info" | "warning" | "error" = "success";
  alert = {
    messages: [],
    titles: [],
  };
  digitalSign = {
    isOpen: false,
    fileId: 0,
    uplId: 0,
    onCloseYes: () => { },
    onCloseNo: () => { },
    // НОВЫЕ ПОЛЯ для поддержки выбора роли
    selectedPositionId: undefined as number | undefined,
    selectedDepartmentId: undefined as number | undefined,
  };
  confirm = {
    errorMessage: [],
    alertYesNo: [],
    bodies: [],
    acceptBtnColor: [],
    cancelBtnColor: [],
    acceptBtnCustomIcon: [],
    cancelBtnCustomIcon: [],
    cancelBtn: [],
    acceptBtn: [],
    onCloseYes: [],
    onCloseNo: [],
    isDeleteReason: [],
  };
  error = {
    openError403: { error: false, message: "" },
    openError422: { error: false, message: "" },
  };
  myRoles: string[] = [];
  isAdmin = false;
  isRegistrar = false;
  isClerk = false;
  isFinancialPlan = false;
  isHeadStructure = false;
  isEmployee = false;
  isArchive = false;
  isAccountant = false;
  isLawyer = false;
  isSmm = false;
  isDutyPlan = false;
  isDeputyChief = false;
  isSecretary = false;
  TechCouncilCount = 0;
  CountAppsFromCabinet = 0;
  BackUrl = ''
  curentUserPin: string = "";

  menu = [];
  menuHeader = [];

  constructor() {
    makeAutoObservable(this);

  }

  setOpenError403 = (flag: boolean, message?: string) => {
    this.error.openError403.error = flag;
    if (flag === false) {
      this.error.openError403.message = "";
    } else {
      this.error.openError403.message = message;
    }
  };

  setOpenError422 = (flag: boolean, message?: string) => {
    this.error.openError422.error = flag;
    if (flag === false) {
      this.error.openError422.message = "";
    } else {
      this.error.openError422.message = message;
    }
  };

  logoutNavigate = () => {
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    this.curentUserPin = null;
  };

  changeSnackbar = (flag: boolean) => {
    this.openSnackbar = flag;
    if ((flag = false)) {
      this.snackbarMessage = "";
      this.snackbarSeverity = "success";
    }
  };

  changeCurrentuserPin = (pin: string) => {
    this.curentUserPin = pin;
  }


  async printDocument(idDocument: number, parameters: {}) {
    try {
      MainStore.changeLoader(true);
      const response = await getFilledTemplate(idDocument, "ru", parameters);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        printJS({
          printable: response.data,
          type: "raw-html",
          targetStyles: ["*"],
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

  async printDocumentByCode(templateCode: string, parameters: {}, lang?: string) {
    try {
      MainStore.changeLoader(true);
      const response = await getFilledTemplateByCode(templateCode, lang ?? "ru", parameters);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        printJS({
          printable: response.data,
          type: "raw-html",
          targetStyles: ["*"],
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

  async getCountMyStructure() {
    try {
      MainStore.changeLoader(true);
      const response = await getCountMyStructure();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.TechCouncilCount = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  setSnackbar(
    message: string,
    severity: "success" | "info" | "warning" | "error" = "success",
    position?: SnackbarOrigin
  ) {
    this.openSnackbar = true;
    this.snackbarMessage = message;
    this.snackbarSeverity = severity;
    if (position) {
      this.positionSnackbar = position;
    }
  }

  async getMyRoles() {
    try {
      const response = await getMyRoles();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.myRoles = response.data;
          this.myRoles.forEach((element) => {
            if (element === RoleCode.ADMIN) {
              this.isAdmin = true;
            } else if (element === RoleCode.HEAD_STRUCTURE) {
              this.isHeadStructure = true;
            } else if (element === RoleCode.REGISTRAR) {
              this.isRegistrar = true;
            } else if (element === RoleCode.FINANCIAL_PLAN) {
              this.isFinancialPlan = true;
            } else if (element === RoleCode.ACCOUNTANT) {
              this.isAccountant = true;
            } else if (element === RoleCode.LAWYER) {
              this.isLawyer = true;
            } else if (element === RoleCode.CLERK) {
              this.isClerk = true;
            } else if (element === RoleCode.EMPLOYEE) {
              this.isEmployee = true;
            } else if (element === RoleCode.ARCHIVE) {
              this.isArchive = true;
            } else if (element === RoleCode.DEPUTYCHIEF) {
              this.isDeputyChief = true;
            } else if (element === RoleCode.SMM) {
              this.isSmm = true;
            } else if (element === RoleCode.DUTY_PLAN) {
              this.isDutyPlan = true;
            } else if (element === RoleCode.SECRETARY) {
              this.isSecretary = true;
            }
          });
        });
        this.createMenuFromRole();
        this.crateHeaderMenu();
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:cannotLoadNotifications"), "error");
    }
  }

  createMenuFromRole() {
    let pageMenu = pages.children;
    if (this.isAdmin) {
      this.menu = pageMenu;
      return;
    }
    else {
      const menuItems = this.myRoles.flatMap(role =>
        RoleMenu[role].flatMap(i => {
          const objectMenu = pageMenu.find(pageItem => pageItem.id === i.group);
          if (objectMenu?.children) {
            return objectMenu.children.filter(child => i.rows.includes(child.id));
          }
          return []
        })
      ).filter(Boolean);
      this.menu = menuItems.reduce((acc, item) => {
        let find = acc.find((f) => f.id === item.id);
        if (!find) {
          acc.push({ ...item });
        }
        return acc;
      }, [])
        ;
    }
  }

  crateHeaderMenu() {
    let pageMenu = pages.children;

    runInAction(() => {
      if (this.isAdmin) {
        this.menuHeader = [];
        return;
      } else {
        const menuItems = this.myRoles.flatMap(role => {
          return RoleMenuHeader[role].flatMap(i => {
            const objectMenu = pageMenu.find(pageItem => pageItem.id === i.group);
            if (objectMenu?.children) {
              return objectMenu.children.filter(child => i.rows.includes(child.id));

            }
          })
        }
        ).filter(Boolean);
        this.menuHeader = menuItems.reduce((acc, item) => {
          if (!acc.some((menuItem) => menuItem.id === item.id)) {
            acc.push(item);
          }
          return acc;
        }, []);
      }
    })
  }

  openErrorDialog = (message: string, title?: string) => {
    this.alert.messages.push(message);
    if (title) this.alert.titles.push(title);
  };

  openDigitalSign = (
    fileId: number,
    onCloseYes: () => void,
    onCloseNo: () => void,
    selectedPositionId?: number,
    selectedDepartmentId?: number
  ) => {
    this.digitalSign.isOpen = true;
    this.digitalSign.fileId = fileId;
    this.digitalSign.onCloseYes = onCloseYes;
    this.digitalSign.onCloseNo = onCloseNo;
    this.digitalSign.selectedPositionId = selectedPositionId;
    this.digitalSign.selectedDepartmentId = selectedDepartmentId;
  };

  // И добавить метод для сброса данных роли при закрытии:
  onCloseDigitalSign = () => {
    this.digitalSign.isOpen = false;
    this.digitalSign.fileId = 0;
    this.digitalSign.uplId = 0;
    this.digitalSign.selectedPositionId = undefined;
    this.digitalSign.selectedDepartmentId = undefined;
  };

  openErrorConfirm = (
    message: string,
    yesLabel: string,
    noLabel: string,
    yesCallback: any,
    noCallback: any,
    yesIcon?: any,
    noIcon?: any,
    yesColor?: string,
    noColor?: string,
    isDeleteReason?: boolean
  ) => {
    this.confirm.errorMessage.push(message);
    this.confirm.acceptBtn.push(yesLabel);
    this.confirm.cancelBtn.push(noLabel);
    this.confirm.onCloseYes.push(yesCallback);
    this.confirm.onCloseNo.push(noCallback);
    this.confirm.acceptBtnColor.push(yesColor);
    this.confirm.cancelBtnColor.push(noColor);
    this.confirm.acceptBtnCustomIcon.push(yesIcon);
    this.confirm.cancelBtnCustomIcon.push(noIcon);
    this.confirm.isDeleteReason.push(isDeleteReason);
  };

  onCloseAlert = () => {
    if (this.alert.messages.length > 0) this.alert.messages.shift();
    if (this.alert.titles.length > 0) this.alert.titles.shift();
  };

  onCloseConfirm = () => {
    if (this.confirm.errorMessage.length > 0) {
      this.confirm.errorMessage.shift();
      this.confirm.acceptBtn.shift();
      this.confirm.cancelBtn.shift();
      this.confirm.onCloseYes.shift();
      this.confirm.onCloseNo.shift();
      this.confirm.acceptBtnColor.shift();
      this.confirm.cancelBtnColor.shift();
      this.confirm.acceptBtnCustomIcon.shift();
      this.confirm.cancelBtnCustomIcon.shift();
    }
  };

  getCountAppsFromCabinet = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getCountApplicationsFromCabinet();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.CountAppsFromCabinet = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  formatDate(date: Dayjs | null | undefined): string | null {
    if (!date) return null;
    if (!dayjs(date).isValid()) return null;
    return dayjs(date).format("YYYY-MM-DDTHH:mm:ss");
  }

  changeLoader(flag: boolean) {
    if (flag) {
      this.loader_counter += 1;
    } else {
      this.loader_counter -= 1;
    }
    if (this.loader_counter <= 0) {
      this.loader = false;
      this.loader_counter = 0;
    } else this.loader = true;
  }

}

const MainStore = new NewStore();
export default MainStore;
