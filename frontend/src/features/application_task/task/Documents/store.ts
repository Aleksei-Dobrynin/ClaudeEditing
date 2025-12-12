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
// НОВЫЕ импорты для работы с динамическими шагами
import {
  addStepsFromService,
  getAdditionalServicesByApplicationId,
  cancelAdditionalService,
  AddStepsFromServiceRequest,
  ApplicationAdditionalService,
} from "api/application_additional_service";
import { 
  DynamicStepInfo, 
  ServicePathOption 
} from "constants/ApplicationAdditionalService";
import { getservice_paths } from "api/service_path";

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
}

// ОБНОВЛЕННЫЙ интерфейс AppStep с новыми полями для динамических шагов
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
  
  // НОВЫЕ ПОЛЯ для динамических шагов
  is_dynamically_added?: boolean;
  additional_service_path_id?: number;
  original_step_order?: number;
  added_by_link_id?: number;
  
  // Дополнительные поля из бэкенда
  documents?: any[];
  workDocuments?: any[];
  requiredCalcs?: Array<{
    id: number;
    structure_id: number;
    structure_name: string;
  }>;
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
  // Существующие данные
  data: AppStep[] = [];
  outgoingData: any[] = [];
  application_id: number = 0;
  hasAccess: boolean = false;
  openPanelUpload: boolean = false;
  isOpenFileView: boolean = false;
  fileUrl = "";
  fileType = "";
  ecpListOpen = false;
  isOpenFileHistory = false;
  signData: any[] = [];

  application: Application | null = null;
  steps: AppStep[] = [];
  documents: AppDocument[] = [];
  fileHistory: AppDocument[] = [];
  approvals: DocumentApproval[] = [];
  departments: Record<number, Department> = {};
  documentTypes: Record<number, DocumentType> = {};
  stepRequiredDocuments: StepRequiredDocument[] = [];
  documentApprovers: DocumentApprover[] = [];

  // Existing UI state
  loading: boolean = false;
  expandedStepId: number | null = null;
  pauseDialogOpen: boolean = false;
  pauseReason: string = "";
  currentStepToPause: number | null = null;
  returnDialogOpen: boolean = false;
  returnReason: string = "";
  currentStepToReturn: number | null = null;
  currentStepId: number = 0;
  currentServiceDocId: number = 0;
  historyDialogOpen: boolean = false;
  currentStepForHistory: number | null = null;
  
  // НОВЫЕ ПОЛЯ для работы с динамическими шагами
  additionalServices: ApplicationAdditionalService[] = [];
  addStepsDialogOpen: boolean = false;
  selectedServicePath: ServicePathOption | null = null;
  addStepsReason: string = "";
  currentStepForAdding: number | null = null;
  availableServicePaths: ServicePathOption[] = [];
  loadingServicePaths: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  // ============================================
  // НОВЫЕ МЕТОДЫ для работы с динамическими шагами
  // ============================================

  /**
   * Загрузить список дополнительных услуг для заявки
   */
  async loadAdditionalServices(applicationId: number) {
    try {
      const response = await getAdditionalServicesByApplicationId(applicationId);
      if (response.status === 200 && response.data) {
        runInAction(() => {
          this.additionalServices = response.data;
        });
      }
    } catch (err) {
      console.error("Error loading additional services:", err);
    }
  }

  /**
   * Открыть диалог добавления шагов
   */
  openAddStepsDialog(stepId: number) {
    runInAction(() => {
      this.currentStepForAdding = stepId;
      this.addStepsDialogOpen = true;
      this.addStepsReason = "";
      this.selectedServicePath = null;
    });
    this.loadAvailableServicePaths();
  }

  /**
   * Закрыть диалог добавления шагов
   */
  closeAddStepsDialog() {
    runInAction(() => {
      this.addStepsDialogOpen = false;
      this.currentStepForAdding = null;
      this.addStepsReason = "";
      this.selectedServicePath = null;
    });
  }

  /**
   * Установить выбранную услугу
   */
  setSelectedServicePath(servicePath: ServicePathOption | null) {
    this.selectedServicePath = servicePath;
  }

  /**
   * Установить причину добавления
   */
  setAddStepsReason(reason: string) {
    this.addStepsReason = reason;
  }

  /**
   * Загрузить доступные service_paths для добавления
   */
  async loadAvailableServicePaths() {
    try {
      runInAction(() => {
        this.loadingServicePaths = true;
      });
      
      const response = await getservice_paths();
      if (response.status === 200 && response.data) {
        runInAction(() => {
          this.availableServicePaths = response.data;
        });
      }
    } catch (err) {
      MainStore.setSnackbar("Ошибка загрузки списка услуг", "error");
    } finally {
      runInAction(() => {
        this.loadingServicePaths = false;
      });
    }
  }

  /**
   * Добавить шаги из выбранной услуги
   */
  async addStepsFromService() {
    if (!this.currentStepForAdding || !this.selectedServicePath || !this.addStepsReason.trim()) {
      MainStore.setSnackbar("Заполните все обязательные поля", "error");
      return;
    }

    // Проверка лимита активных услуг (максимум 3)
    const activeServicesCount = this.additionalServices.filter(
      s => s.status === 'active' || s.status === 'pending'
    ).length;
    
    if (activeServicesCount >= 3) {
      MainStore.setSnackbar("Достигнут лимит активных дополнительных услуг (максимум 3)", "error");
      return;
    }

    MainStore.openErrorConfirm(
      `Добавить ${this.selectedServicePath.steps_count || 'несколько'} шагов из услуги "${this.selectedServicePath.name}"?`,
      "Добавить",
      "Отмена",
      async () => {
        try {
          MainStore.changeLoader(true);

          const request: AddStepsFromServiceRequest = {
            application_id: this.application_id,
            additional_service_path_id: this.selectedServicePath!.id,
            added_at_step_id: this.currentStepForAdding!,
            insert_after_step_id: this.currentStepForAdding!,
            add_reason: this.addStepsReason,
          };

          const response = await addStepsFromService(request);

          if (response.status === 200 || response.status === 201) {
            MainStore.setSnackbar("Шаги успешно добавлены", "success");
            this.closeAddStepsDialog();

            // Перезагружаем данные заявки
            await this.loadApplication(this.application_id);
            await this.loadAdditionalServices(this.application_id);
          } else {
            throw new Error();
          }
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || "Ошибка при добавлении шагов";
          MainStore.setSnackbar(errorMessage, "error");
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

  /**
   * Отменить добавленную услугу
   */
  async cancelAddedService(serviceId: number) {
    const service = this.additionalServices.find(s => s.id === serviceId);
    if (!service) return;

    MainStore.openErrorConfirm(
      `Отменить добавление услуги "${service.service_name}"? Все динамические шаги будут удалены.`,
      "Отменить",
      "Назад",
      async () => {
        try {
          MainStore.changeLoader(true);

          const response = await cancelAdditionalService(serviceId);

          if (response.status === 200 || response.status === 201) {
            MainStore.setSnackbar("Услуга успешно отменена", "success");

            // Перезагружаем данные
            await this.loadApplication(this.application_id);
            await this.loadAdditionalServices(this.application_id);
          } else {
            throw new Error();
          }
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || "Ошибка при отмене услуги";
          MainStore.setSnackbar(errorMessage, "error");
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

  /**
   * Получить информацию о динамическом шаге
   */
  getDynamicStepInfo(stepId: number): DynamicStepInfo {
    const step = this.data.find(s => s.id === stepId);
    
    if (!step || !step.is_dynamically_added) {
      return { isDynamic: false };
    }

    const service = this.additionalServices.find(
      s => s.id === step.added_by_link_id
    );

    return {
      isDynamic: true,
      serviceName: service?.service_name,
      servicePathName: service?.service_path_name,
      addReason: service?.add_reason,
      linkId: step.added_by_link_id,
      canCancel: service?.status === 'pending' || service?.status === 'active',
    };
  }

  /**
   * Проверить, можно ли добавить шаги к текущему шагу
   */
  canAddStepsToStep(stepId: number): boolean {
    const step = this.data.find(s => s.id === stepId);
    if (!step) return false;

    // Можно добавлять только к активному шагу
    if (step.status !== "in_progress") return false;

    // Проверяем лимит активных услуг
    const activeServicesCount = this.additionalServices.filter(
      s => s.status === 'active' || s.status === 'pending'
    ).length;

    return activeServicesCount < 3;
  }

  // ============================================
  // СУЩЕСТВУЮЩИЕ МЕТОДЫ (без изменений)
  // ============================================

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
      
      // Очищаем также новые поля
      this.additionalServices = [];
      this.addStepsDialogOpen = false;
      this.selectedServicePath = null;
      this.addStepsReason = "";
      this.currentStepForAdding = null;
    });
  }

  checkFile(fileName: string) {
    return (
      fileName.toLowerCase().endsWith('.jpg') ||
      fileName.toLowerCase().endsWith('.jpeg') ||
      fileName.toLowerCase().endsWith('.png') ||
      fileName.toLowerCase().endsWith('.pdf')
    );
  }

  async loadApplication(applicationId: number) {
    try {
      this.loading = true;

      await this.getStepDocuments();

      const [docsRes] = await Promise.all([
        getApplicationDocuments(applicationId),
      ]);

      runInAction(() => {
        if (docsRes.status === 200 && docsRes.data) {
          this.documents = docsRes.data;
        }
      });

      // НОВОЕ: Загружаем дополнительные услуги
      await this.loadAdditionalServices(applicationId);

    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  toggleStep(id: number) {
    this.expandedStepId = this.expandedStepId === id ? null : id;
  }

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

    if (step.dependencies == null) step.dependencies = [];

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

  async loadGetSignByFileId(id: number) {
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
  }

  async loadGetUploaded_application_documentsByApplicationIdAndStepId(
    application_document_id: number,
    app_step_id: number
  ) {
    try {
      MainStore.changeLoader(true);
      const response = await getuploaded_application_documentsByApplicationIdAndStepId(
        application_document_id,
        app_step_id
      );
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.fileHistory = response.data.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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

  async loadGetApplicationWorkDocumentByStepID(app_step_id: number) {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationWorkDocumentByStepID(app_step_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.fileHistory = response.data.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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

  async OpenFileFile(idFile: number, fileName: string) {
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
        return;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async downloadFile(idFile: number, fileName: string) {
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
        const blob = new Blob([byteArray], { type: response.data.contentType || 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

  async startStep(stepId: number, structureId: number) {
    try {
      MainStore.changeLoader(true);
      const response = await toProgressStep(stepId);
      if (response.status === 200) {
        await this.loadApplication(this.application_id || 0);
        MainStore.setSnackbar("Этап успешно запущен", "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async completeStep(stepId: number, structureId: number) {
    try {
      MainStore.changeLoader(true);
      const response = await completeStep(stepId);
      if (response.status === 200) {
        await this.loadApplication(this.application_id || 0);
        
        // НОВОЕ: Проверяем, не завершилась ли дополнительная услуга
        const step = this.data.find((s) => s.id === stepId);
        if (step?.is_dynamically_added) {
          await this.loadAdditionalServices(this.application_id);
          
          const service = this.additionalServices.find(
            s => s.id === step.added_by_link_id
          );
          
          if (service?.status === 'completed') {
            MainStore.setSnackbar(
              `Все шаги услуги "${service.service_name}" завершены!`,
              "success"
            );
          }
        }
        
        MainStore.setSnackbar("Этап успешно завершен", "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  showPauseDialog(stepId: number) {
    this.currentStepToPause = stepId;
    this.pauseDialogOpen = true;
    this.pauseReason = "";
  }

  closePauseDialog() {
    this.pauseDialogOpen = false;
    this.currentStepToPause = null;
    this.pauseReason = "";
  }

  setPauseReason(reason: string) {
    this.pauseReason = reason;
  }

  async executePauseStep() {
    if (!this.currentStepToPause || !this.pauseReason.trim()) {
      MainStore.setSnackbar("Укажите причину приостановки", "error");
      return;
    }

    try {
      MainStore.changeLoader(true);
      const response = await pauseStep(this.currentStepToPause, this.pauseReason);
      if (response.status === 200) {
        await this.loadApplication(this.application_id || 0);
        MainStore.setSnackbar("Этап приостановлен", "info");
        this.closePauseDialog();
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async resumeStep(stepId: number) {
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
    }
  }

  showReturnDialog(stepId: number) {
    this.currentStepToReturn = stepId;
    this.returnDialogOpen = true;
    this.returnReason = "";
  }

  closeReturnDialog() {
    this.returnDialogOpen = false;
    this.currentStepToReturn = null;
    this.returnReason = "";
  }

  setReturnReason(reason: string) {
    this.returnReason = reason;
  }

  async executeReturnStep() {
    if (!this.currentStepToReturn || !this.returnReason.trim()) {
      MainStore.setSnackbar("Укажите обоснование возврата", "error");
      return;
    }

    try {
      MainStore.changeLoader(true);
      const response = await returnStep(this.currentStepToReturn, this.returnReason);
      if (response.status === 200) {
        await this.loadApplication(this.application_id || 0);
        MainStore.setSnackbar("Этап возвращен на доработку", "info");
        this.closeReturnDialog();
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  showHistoryDialog(stepId: number) {
    this.currentStepForHistory = stepId;
    this.historyDialogOpen = true;
  }

  closeHistoryDialog() {
    this.historyDialogOpen = false;
    this.currentStepForHistory = null;
  }

  onUploadFile(service_document_id: number, application_document_id: number, step_id: number) {
    this.openPanelUpload = true;
    this.currentServiceDocId = service_document_id;
    this.currentStepId = step_id;
  }

  closeUploadFilePopup() {
    this.openPanelUpload = false;
    this.currentServiceDocId = 0;
    this.currentStepId = 0;
  }
}

export default new ApplicationStepsStore();