import { makeAutoObservable, runInAction } from "mobx";
import MainStore from "MainStore";
import i18n from "i18next";
import {
  getApplication,
  getApplicationSteps,
  getApplicationDocuments,
  getDocumentApprovals,
  getDepartments,
  getUsers,
  getDocumentTypes,
  getStepRequiredDocuments,
  getDocumentApprovers,
  startStep,
  completeStep,
  pauseStep,
  resumeStep,
  returnStep,
  uploadDocument,
  signDocument,
  toProgressStep,
} from "api/ApplicationWorkDocument/documentsApi";
import {
  getApplicationWorkDocumentByStepID,
  getStepDocuments,
  getStepsWithInfo,
  getuploaded_application_documentsBy,
  getuploaded_application_documentsByApplicationIdAndStepId
} from "api/uploaded_application_document";
import { downloadFile, getSignByFileId } from "api/File";
import { getapplication_paymentsByapplication_id } from "api/application_payment";
import { createStepStatusLog } from "api/stepstatuslog";
import {getCurrentUser} from "api/Employee/useGetEmployee"
// Types
interface Department {
  id: number;
  name: string;
}

interface User {
  user_id: number;
  full_name: string;
  department_id: number;
}

interface DocumentType {
  id: number;
  name: string;
}

interface Application {
  id: number;
  number: string;
  status: string;
  start_date: string;
  deadline: string;
  // service_path_id?: number;
}

interface AppStep {
  id: number;
  step_id: number;
  application_id: number;
  path_id?: number;
  name: string;
  description: string;
  responsible_department_id: number;
  status: "completed" | "in_progress" | "waiting" | "paused";
  order_number: number;
  start_date?: string;
  completion_date?: string;
  due_date?: string;
  is_required: boolean;
  dependencies: number[];
  blocks: number[];
}

interface AppDocument {
  id: number;
  application_document_id: number;
  document_type_id: number;
  status: "Подписан" | "В процессе" | "Ожидает";
  file_id: number | null;
  app_step_id: number | null;
  filename: string | null;
  file_name: string | null;
  created_at: any | null;
  created_by_name: string | null;
  structure_name: string | null;
}

interface DocumentApproval {
  id: number;
  app_document_id: number;
  department_id: number;
  status: "Подписан" | "В процессе" | "Ожидает";
  approval_date: string | null;
}

interface StepRequiredDocument {
  step_id: number;
  document_type_id: number;
  is_required: boolean;
}

interface DocumentApprover {
  step_doc_id: number;
  step_id: number;
  document_type_id: number;
  department_id: number;
  position_id: number;
  is_required: boolean;
}

class ApplicationStepsStore {
  // Data
  data = []
  outgoingData = [];
  application_id: number = 0;
  hasAccess: boolean = false;
  openPanelUpload: boolean = false;
  isOpenFileView: boolean = false;
  fileUrl = ""
  fileType = ""
  ecpListOpen = false;
  isOpenFileHistory = false;
  signData = []

  application: Application | null = null;
  steps: AppStep[] = [];
  documents: AppDocument[] = [];
  fileHistory: AppDocument[] = [];
  approvals: DocumentApproval[] = [];
  departments: Record<number, Department> = {};
  // users: Record<number, User> = {};
  documentTypes: Record<number, DocumentType> = {};
  stepRequiredDocuments: StepRequiredDocument[] = [];
  documentApprovers: DocumentApprover[] = [];

  // UI State
  expandedStepId: number | null = null;
  // currentUser = { user_id: 103, department_id: 2 };
  currentUserId = 0;
  loading = false;
  pauseDialogOpen = false;
  pauseReason = "";
  currentStepToPause: number | null = null;
  currentStepId: number = 0;
  currentUploadId: number = 0;
  currentServiceDocId: number = 0;

  returnDialogOpen = false;
  returnReason = "";
  currentStepToReturn: number | null = null;

  historyDialogOpen = false;
  currentStepForHistory: number | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadReferenceData();
  }

  async loadReferenceData() {
    try {
      const [departmentsRes, documentTypesRes] = await Promise.all([
        getDepartments(),
        getDocumentTypes(),
      ]);

      runInAction(() => {
        if (departmentsRes.status === 200 && departmentsRes.data) {
          this.departments = departmentsRes.data.reduce((acc: any, dept: Department) => {
            acc[dept.id] = dept;
            return acc;
          }, {});
        }

        // if (usersRes.status === 200 && usersRes.data) {
        //   this.users = usersRes.data.reduce((acc: any, user: User) => {
        //     acc[user.user_id] = user;
        //     return acc;
        //   }, {});
        // }

        if (documentTypesRes.status === 200 && documentTypesRes.data) {
          this.documentTypes = documentTypesRes.data.reduce((acc: any, docType: DocumentType) => {
            acc[docType.id] = docType;
            return acc;
          }, {});
        }
      });
    } catch (error) {
      console.error("Error loading reference data:", error);
      // Use mock data as fallback
    }
  }

  clearStore() {
    runInAction(() => {
      this.application = null;
      this.steps = [];
      this.documents = [];
      this.approvals = [];
      this.expandedStepId = null;
      this.pauseDialogOpen = false;
      this.pauseReason = "";
      this.currentStepToPause = null;
      this.currentUserId = 0;
    });
  }

  checkFile(fileName: string) {
    return (fileName.toLowerCase().endsWith('.jpg') ||
      fileName.toLowerCase().endsWith('.jpeg') ||
      fileName.toLowerCase().endsWith('.png') ||
      fileName.toLowerCase().endsWith('.pdf'));
  }

  async loadApplication(applicationId: number) {
    try {
      this.loading = true;

      // await this.loaduploaded_application_documents();
      // this.getStepsWithInfo()
      await this.getStepDocuments()
      await this.loadCurrentUserId()

      // Load application data
      const [docsRes] = await Promise.all([
        // getApplicationSteps(applicationId),
        getApplicationDocuments(applicationId),
        // getDocumentApprovals(applicationId),
      ]);

      runInAction(() => {
        // if (appRes.status === 200 && appRes.data) {
        //   this.application = appRes.data;
        // }

        // if (stepsRes.status === 200 && stepsRes.data) {
        //   this.steps = stepsRes.data;
        // }

        if (docsRes.status === 200 && docsRes.data) {
          this.documents = docsRes.data;
        }

        // if (approvalsRes.status === 200 && approvalsRes.data) {
        //   this.approvals = approvalsRes.data;
        // }
      });

      // Load step requirements if we have path_id from steps
      // const pathId = stepsRes.data?.[0]?.path_id;
      // if (pathId) {
      //   const [stepReqRes, docApproversRes] = await Promise.all([
      //     getStepRequiredDocuments(pathId),
      //     getDocumentApprovers(pathId),
      //   ]);

      //   runInAction(() => {
      //     if (stepReqRes.status === 200 && stepReqRes.data) {
      //       this.stepRequiredDocuments = stepReqRes.data;
      //     }

      //     if (docApproversRes.status === 200 && docApproversRes.data) {
      //       this.documentApprovers = docApproversRes.data;
      //     }
      //   });
      // }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
      // Fallback to mock data
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }


  toggleStep(id: number) {
    this.expandedStepId = this.expandedStepId === id ? null : id;
  }

  // async getStepsWithInfo() {
  //   try {
  //     MainStore.changeLoader(true);
  //     const response = await getStepsWithInfo(this.application_id);
  //     if ((response.status === 201 || response.status === 200) && response?.data !== null) {
  //       this.data = response.data;
  //     } else {
  //       throw new Error();
  //     }
  //   } catch (err) {
  //     MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
  //   } finally {
  //     MainStore.changeLoader(false);
  //   }
  // }

  async getStepDocuments() {
    try {
      MainStore.changeLoader(true);
      const response = await getStepDocuments(this.application_id);
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
  }


  isStepCompleted(stepId: number) {
    const step = this.data.find((s) => s.step_id === stepId);
    return step && step.status === "completed";
  }

  canStartStep(stepId: number) {
    const step = this.data.find((s) => s.step_id === stepId);
    if (!step) return false;

    if (step.dependencies == null) step.dependencies = []; //TODO

    return step.dependencies.every((depStepId) =>
      this.isStepCompleted(depStepId)
    );
  }

  canCompleteStep(stepId: number) {
    const stepDocTypes = this.stepRequiredDocuments.filter(
      (srd) => srd.step_id === stepId && srd.is_required
    );

    return stepDocTypes.every((sdt) => {
      const appDoc = this.documents.find((doc) => doc.document_type_id === sdt.document_type_id);
      if (!appDoc) return false;

      const requiredApprovers = this.documentApprovers.filter(
        (da) =>
          da.step_id === stepId && da.document_type_id === sdt.document_type_id && da.is_required
      );

      return requiredApprovers.every((ra) => {
        return this.approvals.some(
          (a) =>
            a.app_document_id === appDoc.id &&
            a.department_id === ra.department_id &&
            a.status === "Подписан"
        );
      });
    });
  }

  async loadGetSignByFileId(id) {
    try {
      MainStore.changeLoader(true);
      const response = await getSignByFileId(id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.signData = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async loadCurrentUserId(){
    try {
      MainStore.changeLoader(true);
      const response = await getCurrentUser();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.currentUserId = response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async loadGetUploaded_application_documentsByApplicationIdAndStepId(application_document_id: number, app_step_id: number) {
    try {
      MainStore.changeLoader(true);
      const response = await getuploaded_application_documentsByApplicationIdAndStepId(application_document_id, app_step_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.fileHistory = response.data.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async loadGetApplicationWorkDocumentByStepID(app_step_id: number) {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationWorkDocumentByStepID(app_step_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.fileHistory = response.data.sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
  
  async OpenFileFile(idFile: number, fileName) {
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
        let mimeType = 'application/pdf';
        this.fileType = 'pdf';
        if (fileName.endsWith('.png')) {
          mimeType = 'image/png';
          this.fileType = 'png';
        }
        if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
          mimeType = 'image/jpeg';
          this.fileType = 'jpg';
        }
        const blob = new Blob([byteArray], { type: mimeType });
        this.fileUrl = URL.createObjectURL(blob);
        this.isOpenFileView = true;
        return
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  onUploadFile(service_document_id: number, upload_id: number, step_id: number) {
    this.currentServiceDocId = service_document_id;
    this.currentUploadId = upload_id
    this.openPanelUpload = true;
    this.currentStepId = step_id
  }

  closeUploadFilePopup() {
    this.currentServiceDocId = 0;
    this.currentUploadId = 0
    this.openPanelUpload = false;
    this.currentStepId = 0
  }

  showPauseDialog(stepId: number) {
    this.currentStepToPause = stepId;
    this.pauseReason = "";
    this.pauseDialogOpen = true;
  }

  showHistoryDialog(stepId: number) {
  this.currentStepForHistory = stepId;
  this.historyDialogOpen = true;
}

closeHistoryDialog() {
  this.historyDialogOpen = false;
  this.currentStepForHistory = null;
}

  closePauseDialog() {
    this.pauseDialogOpen = false;
    this.pauseReason = "";
    this.currentStepToPause = null;
  }

  setPauseReason(reason: string) {
    this.pauseReason = reason;
  }

  async executePauseStep() {
    if (!this.currentStepToPause || !this.pauseReason.trim()) {
      MainStore.setSnackbar("Укажите причину приостановки", "error");
      return;
    }

    MainStore.openErrorConfirm(
      "Вы точно хотите приостановить шаг?",
      "Да",
      "Нет",
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await pauseStep(this.currentStepToPause, this.pauseReason);
          if (response.status === 200) {
            await this.loadApplication(this.application_id || 0);
            MainStore.setSnackbar(`Этап  приостановлен`, "info");
            this.closePauseDialog();
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
      () => {
        MainStore.onCloseConfirm();
      }
    );
  }

  async resumeStep(stepId: number) {
    MainStore.openErrorConfirm(
      "Вы точно хотите возобновить шаг?",
      "Да",
      "Нет",
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await resumeStep(stepId);
          if (response.status === 200) {
            await this.loadApplication(this.application_id || 0);
            MainStore.setSnackbar("Этап возобновлен", "success");
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
      () => {
        MainStore.onCloseConfirm();
      }
    );
  }

  async uploadDocument(docTypeId: number) {
    try {
      MainStore.changeLoader(true);

      // In real implementation, you would get the file from file input
      // For now, we'll just call the API
      const response = await uploadDocument({
        applicationId: this.application?.id || 0,
        documentTypeId: docTypeId,
        file: new File([""], "document.pdf"), // This would be the actual file
      });

      if (response.status === 200 || response.status === 201) {
        // Reload documents
        await this.loadApplication(this.application_id || 0);
        MainStore.setSnackbar(
          `Документ "${this.documentTypes[docTypeId].name}" загружен`,
          "success"
        );
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async signDocument(docId: number) {
    try {
      MainStore.changeLoader(true);

      const response = await signDocument(docId);

      if (response.status === 200) {
        // Reload documents and approvals
        await this.loadApplication(this.application_id || 0);
        MainStore.setSnackbar("Документ успешно подписан", "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }


  async loadapplication_payments() {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_paymentsByapplication_id(this.application_id)
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        return response.data;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  async completeStep(stepId: number, structureId: number) {

    if (!this.canCompleteStep(stepId)) {
      MainStore.setSnackbar(
        "Невозможно завершить шаг. Убедитесь, что все обязательные документы подписаны.",
        "error"
      );
      return;
    }

    const payments = await this.loadapplication_payments();
    const payment = payments?.find(x => x.structure_id === structureId);
    let text = "Вы точно хотите завершить шаг?"
    if (!payment) {
      text = `НЕТ ДАННЫХ ПО КАЛЬКУЛЯЦИИ.<br /> Вы хотите завершить текущий  этап?`
    }

    MainStore.openErrorConfirm(
      text,
      "Да",
      "Нет",
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await completeStep(stepId);
          if (response.status === 200) {
            await this.loadApplication(this.application_id || 0);
            const step = this.data.find((s) => s.id === stepId);
            MainStore.setSnackbar(`Шаг "${step?.name}" успешно завершен!`, "success");
            if (step.blocks?.length === 0) {
              MainStore.openErrorDialog("Последний этап завершен! Не забудьте поменять статус заявки!")
            }
            // if(this.data.every(x => x.status === "completed")){
            //   MainStore.openErrorDialog("Последний этап завершен! Не забудьте поменять статус заявки!")
            // }
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
      () => {
        MainStore.onCloseConfirm();
      }
    );
  }

  showReturnDialog(stepId: number) {
    this.currentStepToReturn = stepId;
    this.returnReason = "";
    this.returnDialogOpen = true;
  }

  closeReturnDialog() {
    this.returnDialogOpen = false;
    this.returnReason = "";
    this.currentStepToReturn = null;
  }

  setReturnReason(reason: string) {
    this.returnReason = reason;
  }

  async returnStep(stepId: number) {
    this.showReturnDialog(stepId);
  }

  async executeReturnStep() {
    if (!this.currentStepToReturn || !this.returnReason.trim()) {
      MainStore.setSnackbar("Укажите обоснование возврата", "error");
      return;
    }

    MainStore.openErrorConfirm(
      "Вы точно хотите вернуть шаг?",
      "Да",
      "Нет",
      async () => {
        try {
          MainStore.changeLoader(true);

          const step = this.data.find((s) => s.id === this.currentStepToReturn);
          if (!step) {
            throw new Error("Шаг не найден");
          }

          const statusLogData = {
            app_step_id: this.currentStepToReturn!,
            old_status: step.status,
            new_status: "waiting",
            change_date: new Date().toISOString(),
            comments: this.returnReason
          };

          const logResponse = await createStepStatusLog(statusLogData);

          if (logResponse.status !== 200 && logResponse.status !== 201) {
            throw new Error("Ошибка при создании записи в журнале");
          }

          const response = await returnStep(this.currentStepToReturn!, this.returnReason);

          if (response.status === 200) {
            await this.loadApplication(this.application_id || 0);
            MainStore.setSnackbar(`Шаг "${step?.name}" возвращен`, "info");
            this.closeReturnDialog();
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
      () => {
        MainStore.onCloseConfirm();
      }
    );
  }

  async toProgress(stepId: number) {
    MainStore.openErrorConfirm(
      "Вы точно хотите начать прогресс?",
      "Да",
      "Нет",
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await toProgressStep(stepId);
          if (response.status === 200) {
            await this.loadApplication(this.application_id || 0);
            const step = this.data.find((s) => s.id === stepId);
            MainStore.setSnackbar(`Шаг "${step?.name}" в процессе`, "info");
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
      () => {
        MainStore.onCloseConfirm();
      }
    );
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

export default new ApplicationStepsStore();
