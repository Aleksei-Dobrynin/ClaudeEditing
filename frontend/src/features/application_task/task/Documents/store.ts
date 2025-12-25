// Путь: frontend/src/features/application_task/task/Documents/store.ts

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
  deleteUploadedApplicationDocument,
  getApplicationWorkDocumentByStepID,
  getStepDocuments,
  getStepsWithInfo,
  getuploaded_application_documentsBy,
  getuploaded_application_documentsByApplicationIdAndStepId
} from "api/uploaded_application_document";
import { downloadFile, getSignByFileId } from "api/File";
import { getapplication_paymentsByapplication_id } from "api/application_payment";
import { createStepStatusLog } from "api/stepstatuslog";
import {
  getapplication_additional_service, setApplicationAdditionalServiceCancel
} from "../../../../api/ApplicationAdditionalService/applicationAdditionalServiceApi";

// ========== НОВЫЙ ИМПОРТ ==========
import { getDocumentApprovalsWithAssignees } from "api/DocumentApproval/useGetDocumentApprovals";
// ===================================

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

export interface AppStep {
  id: number;
  step_id: number;
  application_id: number;
  path_id?: number;
  name: string;
  description: string;
  responsible_department_id: number;
  status: "completed" | "in_progress" | "waiting" | "paused" | "cancelled";
  order_number: number;
  start_date?: string;
  completion_date?: string;
  due_date?: string;
  is_required: boolean;
  dependencies: number[];
  blocks: number[];
  is_dynamically_added?: boolean;
  additional_service_id?: number | null;
  additional_service_name?: string | null;
  added_by_link_id?: number | null;
  original_step_order?: number | null;

  step_name?: string;
  responsible_department_name?: string;

  is_paused?: boolean;
  pause_reason?: string;
}

export interface NestedStepGroup {
  linkId: number;
  serviceName: string;
  addedAt?: string;
  requestedBy?: string;
  addReason?: string;
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  steps: AppStep[];
  parentStepId: number;
}

/**
 * Результат группировки шагов
 */
export interface GroupedSteps {
  regularSteps: AppStep[];
  groupsByParentId: Map<number, NestedStepGroup[]>;
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
  delete_reason: string | null;
  deleted_by_name: string | null;
  approvals?: any[]; // Массив согласований с assigned_approvers
}

interface DocumentApproval {
  id: number;
  app_document_id: number;
  department_id: number;
  status: "Подписан" | "В процессе" | "Ожидает";
  approval_date: string | null;
  order_number: number | null;
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
  expandedStepIds: number[] = [];
  currentUser = { user_id: 103, department_id: 2 };
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
  application_additional_service = [];
  cancelServiceDialogOpen = false;
  serviceToCancelId: number | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadReferenceData();
  }

  openCancelServiceDialog(id: number) {
    this.serviceToCancelId = id;
    this.cancelServiceDialogOpen = true;
  }

  closeCancelServiceDialog() {
    this.cancelServiceDialogOpen = false;
    this.serviceToCancelId = null;
  }

  async confirmCancelAdditionalService() {
    if (!this.serviceToCancelId) return;

    try {
      const response = await setApplicationAdditionalServiceCancel(this.serviceToCancelId);
      console.log(response);
      if (response.status === 200 && response.data.error) {
        MainStore.openErrorDialog(response.data.error, "Ошибка");
        this.closeCancelServiceDialog();
      } else {
        throw new Error();
      }
      this.closeCancelServiceDialog();
      await this.loadApplication(this.application_id);
    } catch (e: any) {
      MainStore.openErrorDialog(i18n.t("Ошибка отмены дополнительной услуги"), "Ошибка");
    }
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
      this.expandedStepIds = [];
      this.pauseDialogOpen = false;
      this.pauseReason = "";
      this.currentStepToPause = null;
    });
  }

  checkFile(fileName: string) {
    return (fileName.toLowerCase().endsWith('.jpg') ||
      fileName.toLowerCase().endsWith('.jpeg') ||
      fileName.toLowerCase().endsWith('.png') ||
      fileName.toLowerCase().endsWith('.pdf'));
  }

  // ПУТ�: frontend/src/features/application_task/task/Documents/store.ts
  // ИСПРАВЛЕНИЕ: Метод loadApplication (строки ~270-310)

  // Путь: frontend/src/features/application_task/task/Documents/store.ts
  // ТОЛЬКО МЕТОД loadApplication - КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ

// ФРАГМЕНТ: frontend/src/features/application_task/task/Documents/store.ts
// Метод loadApplication - ИСПРАВЛЕННАЯ ВЕРСИЯ

async loadApplication(applicationId: number) {
  try {
    this.loading = true;

    // 1. Загружаем структуру этапов с документами (БЕЗ approvals)
    await this.getStepDocuments();

    // 2. Загружаем approvals С назначенными исполнителями
    const [docsRes] = await Promise.all([
      getDocumentApprovalsWithAssignees({ 
        applicationId: applicationId 
      })
    ]);

    runInAction(() => {
      if (docsRes.status === 200 && docsRes.data) {
        // 3. Группируем approvals по документам
        const approvalsByDocId = docsRes.data.reduce((acc: any, approval: any) => {
          const docId = approval.document_type_id; // или app_document_id в зависимости от структуры
          if (!acc[docId]) {
            acc[docId] = [];
          }
          acc[docId].push(approval);
          return acc;
        }, {});

        console.log('Approvals grouped by document:', approvalsByDocId);

        // 4. КРИТИЧЕСКОЕ ИЗМЕНЕНИЕ: Добавляем approvals в step.documents внутри this.data
        this.data = this.data.map(step => ({
          ...step,
          documents: step.documents?.map(doc => ({
            ...doc,
            approvals: approvalsByDocId[doc.document_type_id] || []
          }))
        }));

        console.log('Updated this.data with approvals:', this.data);
      }
    });

    this.loadGetApplication_additional_service(applicationId);

  } catch (err) {
    console.error('Error loading application with assignees:', err);
    MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
  } finally {
    runInAction(() => {
      this.loading = false;
    });
  }
}
  // ========== НОВЫЙ МЕТОД: Загрузка для конкретного этапа ==========
  /**
   * Загружает согласования для конкретного этапа с исполнителями
   */
  async loadApprovalsForStep(applicationId: number, stepId: number) {
    try {
      this.loading = true;

      const response = await getDocumentApprovalsWithAssignees({
        applicationId: applicationId,
        stepId: stepId
      });

      runInAction(() => {
        if (response.status === 200 && response.data) {
          // Обновляем только согласования для данного этапа
          const stepDocuments = response.data;

          // Если нужно обновить существующий массив documents
          this.documents = this.documents.map(doc => {
            const updated = stepDocuments.find((sd: any) => sd.id === doc.id);
            return updated || doc;
          });

          console.log('Loaded step approvals with assignees:', stepDocuments);
        }
      });

    } catch (error) {
      console.error('Error loading step approvals:', error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  // ========== НОВЫЙ МЕТОД: Обновление согласований ==========
  /**
   * Обновляет информацию о согласованиях после изменений
   * Полезно после добавления/удаления подписанта
   */
  async refreshApprovals(applicationId: number) {
    try {
      const response = await getDocumentApprovalsWithAssignees({
        applicationId: applicationId
      });

      runInAction(() => {
        if (response.status === 200 && response.data) {
          // Обновляем approvals для каждого документа
          response.data.forEach((newApproval: any) => {
            const docIndex = this.documents.findIndex(
              doc => doc.id === newApproval.app_document_id
            );

            if (docIndex !== -1) {
              // Обновляем approvals документа
              this.documents[docIndex].approvals = response.data.filter(
                (approval: any) => approval.app_document_id === newApproval.app_document_id
              );
            }
          });
        }
      });
    } catch (error) {
      console.error('Error refreshing approvals:', error);
    }
  }
  // ========== КОНЕЦ НОВЫХ МЕТОДОВ ==========


  toggleStep(id: number) {
    const index = this.expandedStepIds.indexOf(id);
    if (index > -1) {
      // Закрыть - удалить из массива
      this.expandedStepIds.splice(index, 1);
    } else {
      // Открыть - добавить в массив
      this.expandedStepIds.push(id);
    }
  }

  // Дополнительный метод для проверки открыт ли шаг
  isStepExpanded(id: number): boolean {
    return this.expandedStepIds.includes(id);
  }

  // ПУТЬ: frontend/src/features/application_task/task/Documents/store.ts
  // ИСПРАВЛЕНИЕ: Метод getStepDocuments (строки ~390-410)

  async getStepDocuments() {
    // ✅ КРИТИЧЕСКАЯ ВАЛИДАЦИЯ: Проверяем application_id
    if (!this.application_id || this.application_id <= 0) {
      console.error('[Documents/store] getStepDocuments called with invalid application_id:', this.application_id);
      MainStore.setSnackbar('Ошибка: application_id не установлен', "error");
      return;
    }

    try {
      MainStore.changeLoader(true);

      // ✅ Логируем для отладки
      console.log('[Documents/store] getStepDocuments called with application_id:', this.application_id);

      const response = await getStepDocuments(this.application_id);

      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.data = response.data;
          console.log('[Documents/store] Loaded steps:', this.data.length);
        });
      } else {
        throw new Error('Invalid response from getStepDocuments');
      }
    } catch (err) {
      console.error('[Documents/store] Error in getStepDocuments:', err);
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

  // ========== ОБНОВЛЕННЫЙ МЕТОД signDocument ==========
  async signDocument(docId: number) {
    try {
      MainStore.changeLoader(true);

      const response = await signDocument(docId);

      if (response.status === 200) {
        // Обновляем данные о согласованиях
        await this.refreshApprovals(this.application_id);
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

  async loadGetApplication_additional_service(application_id: number) {
    try {
      MainStore.changeLoader(true);
      const response = await getapplication_additional_service(application_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.application_additional_service = response.data
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };

  // ========== ОБНОВЛЕННЫЙ МЕТОД handleDeleteUploadedDocument ==========
  async handleDeleteUploadedDocument(uplId: number, reason: string) {
    try {
      MainStore.changeLoader(true);
      const response = await deleteUploadedApplicationDocument(uplId, reason);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        await this.loadApplication(this.application_id);
        MainStore.setSnackbar("Файл удалён. Все подписи сброшены.", "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  };
}

export default new ApplicationStepsStore();