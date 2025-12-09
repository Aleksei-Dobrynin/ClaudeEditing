import { makeAutoObservable, runInAction } from "mobx";
import { validate } from "./valid";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  createTechCouncil,
  updateTechCouncil,
  getTechCouncilsByApplicationId,
  uploadTechCouncilsFile, updateTechCouncilLegalRecords, getGetTableBySession
} from "api/TechCouncil";
import { getMyOrgStructures } from "../../../api/org_structure";
import { getApplication } from "../../../api/Application/useGetApplication";
import { Application } from "constants/Application";
import { Customer } from "constants/Customer";
import { getArchObjectsByAppId } from "../../../api/ArchObject/useGetArchObjects";
import { getDecisionTypes } from "../../../api/DecisionType";
import { getCustomer } from "../../../api/Customer/useGetCustomer";
import { downloadFile } from "api/File";
import { getApplicationLegalRecords } from "../../../api/ApplicationLegalRecord";
import { gettech_decisions } from "../../../api/tech_decision";
import { updateApplicationTechTags } from "../../../api/structure_tag";

interface LegalRecord {
  application_legal_record_id: number;
}

class NewStore {
  id = 0;
  structure_id = 0;
  application_id = 0;
  decision_type_id = 0;
  service_id = 0;
  decision = "";
  org_structures = [];
  participants = [];
  techCouncilData = [];
  arch_objects = [];
  decision_types = [];
  ApplicationLegalRecord = [];
  selectedLegalRecords = [];
  tech_decisions = [];
  application_cases = [];
  first_structure_id = 0;
  currentId = 0;
  isOpenFilePanel = false;
  isOpenLegalRecordsPanel = false;
  taskEdited = false;
  errorstructure_id = "";
  errorapplication_id = "";
  errordecision = "";
  errordecision_type_id = "";

  fileName = "";
  File = null;
  idDocumentinputKey = "";
  errorFileName = "";
  fileAdd_id = 0;
  fileAdd_application_id = 0;
  fileAdd_structure_id = 0;

  legalRecordAdd_id = 0;
  legalRecordAdd_application_id = 0;
  legalRecordAdd_structure_id = 0;
  errortech_decision_id = '';
  TechFileName = "";
  errorTechFileName = ""
  idTechDocumentinputKey = Math.random().toString(36);

  Application: Application = {
    id: 0,
    registration_date: null,
    customer_id: 0,
    status_id: 0,
    workflow_id: 0,
    service_id: 0,
    deadline: null,
    arch_object_id: 0,
    updated_at: null,
    customer: null,
    archObjects: null,
    number: "",
    work_description: "",
    object_tag_id: 0,
    tech_decision_id: 0
  };
  Customer: Customer = {
    id: 0,
    pin: "",
    is_organization: false,
    full_name: "",
    address: "",
    director: "",
    okpo: "",
    organization_type_id: 0,
    payment_account: "",
    postal_code: "",
    ugns: "",
    bank: "",
    bik: "",
    registration_number: "",
    sms_1: "",
    sms_2: "",
    email_1: "",
    email_2: "",
    telegram_1: "",
    telegram_2: "",
    document_date_issue: null,
    document_serie: "ID AN ",
    identity_document_type_id: null,
    document_whom_issued: "МКК ",
    individual_surname: "",
    individual_name: "",
    individual_secondname: "",
    customerRepresentatives: [],
  };

  constructor() {
    makeAutoObservable(this);
  }

  changeDocInputKey() {
    this.idDocumentinputKey = Math.random().toString(36);
  }

  clearStore() {
    runInAction(() => {
      this.id = 0;
      this.structure_id = 0;
      this.application_id = 0;
      this.decision_type_id = 0;
      this.decision = "";
      this.org_structures = [];
      this.participants = [];
      this.techCouncilData = [];
      this.arch_objects = [];
      this.decision_types = [];
      this.ApplicationLegalRecord = [];
      this.selectedLegalRecords = [];
      this.first_structure_id = 0;
      this.currentId = 0;
      this.isOpenFilePanel = false;
      this.isOpenLegalRecordsPanel = false;
      this.errorstructure_id = "";
      this.errorapplication_id = "";
      this.errordecision = "";
      this.errordecision_type_id = "";
      this.errortech_decision_id = "";
    });
  }

  handleChange(event) {
    this[event.target.name] = event.target.value;
    validate(event);
  }

  handleTechCouncilChange = (event, id) => {
    const { name, value } = event.target;
    this.techCouncilData = this.techCouncilData.map((item) =>
      item.id === id ? { ...item, [name]: value } : item
    );
  };

  sign(callback) {
    MainStore.digitalSign.fileId = 0;
    MainStore.openDigitalSign(
      0,
      async () => {
        MainStore.onCloseDigitalSign();
        callback && callback();
      },
      () => MainStore.onCloseDigitalSign(),
    );
  };


  onSaveClick = async (id: number) => {
    var techCouncil = this.techCouncilData.find(t => t.id === id);

    let canSave = true;
    let event: { target: { name: string; value: any } };
    event = { target: { name: "decision", value: techCouncil.decision } };
    canSave = validate(event) && canSave;

    if (canSave) {
      try {
        MainStore.changeLoader(true);
        var data = {
          id: techCouncil.id,
          structure_id: techCouncil.structure_id,
          application_id: techCouncil.application_id,
          decision: techCouncil.decision,
          decision_type_id: techCouncil.decision_type_id
        };

        const response = data.id === 0
          ? await createTechCouncil(data)
          : await updateTechCouncil(data);

        if (response.status === 201 || response.status === 200) {
          this.loadTechCouncil(this.Application.id);
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

  saveApplicationTags = async () => {
    if (this.Application.tech_decision_id < 1 || this.Application.tech_decision_id == null) {
      this.errortech_decision_id = "Обязательное поле!"
      return
    }
    if ((this.TechFileName == null || this.TechFileName == "") &&
      this.Application.tech_decision_id != this.tech_decisions.find(x => x.code == "approve").id) {
      this.errorTechFileName = "Нужно загрузить файл заключения"
    }

    try {
      MainStore.changeLoader(true);
      const response = await updateApplicationTechTags(
        this.Application.id,
        this.Application.tech_decision_id,
        this.File,
        this.TechFileName);
      if (response.status === 201 || response.status === 200) {
        runInAction(() => {
          this.taskEdited = false;
        })
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  changeTechDecision(tech_decision_id: number) {
    if (tech_decision_id == 0) {
      this.errortech_decision_id = "Обязательное поле!"
    } else {
      this.errortech_decision_id = ""
    }

    if (tech_decision_id == this.tech_decisions.find(x => x.code == "approve").id) {
      this.errorTechFileName = ""
    }
    this.taskEdited = true;
    this.Application.tech_decision_id = tech_decision_id
  }

  changeTechDocInputKey() {
    this.idTechDocumentinputKey = Math.random().toString(36);
    if (this.TechFileName != null && this.TechFileName != "") {
      this.errorTechFileName = ""
    } else {
      this.errorTechFileName = "Обязательное поле!"
    }
  }

  loadTechDesisions = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await gettech_decisions();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.tech_decisions = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  openFilePanel(id: number, application_id: number, structure_id: number) {
    this.isOpenFilePanel = true;
    this.fileName = "";
    this.File = null;
    this.idDocumentinputKey = "";
    this.errorFileName = "";
    this.fileAdd_id = id;
    this.fileAdd_application_id = application_id;
    this.fileAdd_structure_id = structure_id;
  }

  closeFilePanel() {
    this.isOpenFilePanel = false;
  }

  async uploadFile(onSaved: (id: number) => void) {
    var data = {
      id: this.fileAdd_id - 0,
      application_id: this.fileAdd_application_id - 0,
      structure_id: this.fileAdd_structure_id - 0
    };
    try {
      MainStore.changeLoader(true);
      const response = await uploadTechCouncilsFile(data, this.File, this.fileName);
      if (response.status === 201 || response.status === 200) {
        const responseData = await getTechCouncilsByApplicationId(this.Application.id);
        if (responseData.status === 200 && responseData?.data !== null) {
          runInAction(() => {
            const item = this.techCouncilData.find((item) => item.structure_id == data.structure_id);
            if (item) {
              const updatedItem = responseData.data.find((item) => item.structure_id === data.structure_id);
              if (updatedItem) {
                item.files = updatedItem.files || [];
              }
            }
          });
        }
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

  openLegalRecords(id: number, application_id: number, structure_id: number, legal_records: LegalRecord[] = []) {
    let records = legal_records.map(r => r.application_legal_record_id);
    this.isOpenLegalRecordsPanel = true;
    this.legalRecordAdd_id = id;
    this.legalRecordAdd_application_id = application_id;
    this.legalRecordAdd_structure_id = structure_id;
    this.selectedLegalRecords = records.length ? records : [];
  }

  closeLegalRecords() {
    this.isOpenLegalRecordsPanel = false;
    this.loadTechCouncil(this.Application.id);
  }

  saveLegalRecords = async () => {
    try {
      MainStore.changeLoader(true);
      var data = {
        id: this.legalRecordAdd_id - 0,
        application_id: this.legalRecordAdd_application_id - 0,
        structure_id: this.legalRecordAdd_structure_id - 0,
        legal_records: this.selectedLegalRecords
      };
      const response = await updateTechCouncilLegalRecords(data);
      if (response.status === 201 || response.status === 200) {
        this.loadTechCouncil(this.Application.id);
          MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadTechCouncil = async (id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getTechCouncilsByApplicationId(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.techCouncilData = response.data.sort((a, b) => {
            if (a.structure_id === this.first_structure_id) return -1;
            if (b.structure_id === this.first_structure_id) return 1;
            return 0;
          });
        });
        const firstElement = this.techCouncilData[0];
        if (firstElement) {
          if (firstElement.tech_council_session_id == null) return;
          const listData = await getGetTableBySession(firstElement.tech_council_session_id);
          runInAction(() => {
            if (listData.status === 200 && listData?.data) {
              this.application_cases = listData.data;
            } else {
              throw new Error();
            }
          });
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadDecisionTypes = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getDecisionTypes();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.decision_types = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async loadStructure() {
    try {
      MainStore.changeLoader(true);
      const userStructures = await getMyOrgStructures();
      if (userStructures.status != 200) {
        throw new Error();
      }
      this.first_structure_id = userStructures.data[0]?.id;
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadApplication = async (application_id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplication(application_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.Application = response.data;
        });
        this.loadCustomer(response.data.customer_id);
        this.loadArchObjects(response.data.id);
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadApplicationLegalRecord = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationLegalRecords();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.ApplicationLegalRecord = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  loadCustomer = async (customer_id: number) => {
    try {
      const response = await getCustomer(customer_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.Customer = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    }
  };

  async downloadFile(idFile: number, fileName) {
    try {
      MainStore.changeLoader(true);
      const response = await downloadFile(idFile);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const byteCharacters = atob(response.data.fileContents);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        const mimeType = response.data.contentType || "application/octet-stream";
        const fileNameBack = response.data.fileDownloadName;

        let url = "";

        if (fileNameBack.endsWith(".jpg") || fileNameBack.endsWith(".jpeg") || fileNameBack.endsWith(".png")) {
          const newWindow = window.open();
          if (newWindow) {
            const blob = new Blob([byteArray], { type: mimeType });
            url = window.URL.createObjectURL(blob);
            newWindow.document.write(`<img src="${url}" />`);
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            console.error("Не удалось открыть новое окно. Возможно, оно было заблокировано.");
          }
        } else if (fileNameBack.endsWith(".pdf")) {
          const newWindow = window.open();
          if (newWindow) {
            const blob = new Blob([byteArray], { type: "application/pdf" });
            url = window.URL.createObjectURL(blob);
            newWindow.location.href = url;
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            console.error("Не удалось открыть новое окно. Возможно, оно было заблокировано.");
          }
        }

        const blob = new Blob([byteArray], { type: mimeType });
        url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", response.data.fileDownloadName || fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  loadArchObjects = async (app_id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getArchObjectsByAppId(app_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(async () => {
          this.arch_objects = response.data;
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
    await this.loadTechDesisions();
    await this.loadStructure();
    await this.loadApplication(Number(id));
    await this.loadDecisionTypes();
    if (id == null || id == 0) {
      return;
    }
    this.id = id;
    this.loadTechCouncil(id);
  }
}

export default new NewStore();
