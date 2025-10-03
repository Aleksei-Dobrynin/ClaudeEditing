import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";

export type SnackbarSeverity = "success" | "error" | "warning" | "info";

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

export class RootStore {
  currentStep = 0;
  service_id = 0;
  isLoading = false;
  applicationId: number = 0;
  statusId: number = 0;
  statusName: number = 0;
  companyId: number = 0;
  deadline = null;
  number = "";
  comment = "";
  applicationStatus: string | null = null;
  applicationNumber: string = "";
  isDigitallySigned: boolean = false;
  digitalSignatureDate: Date | null = null;
  dogovorTemplate: string = "";

  useCache = false;

  // Флаг для диалога подтверждения выхода
  showExitDialog = false;
  // В RootStore.ts добавьте:
  dictionariesLoaded = false;

  setDictionariesLoaded(loaded: boolean) {
    this.dictionariesLoaded = loaded;
  }

  snackbar: SnackbarState = {
    open: false,
    message: "",
    severity: "info",
  };

  steps = [
    "label:ApplicationAddEditView.steps_objects",
    "label:ApplicationAddEditView.steps_applicant",
    "label:ApplicationAddEditView.steps_documents",
    "label:ApplicationAddEditView.steps_review",
  ];

  constructor() {
    makeAutoObservable(this);
  }

  async loadTemplateDogovor() {
  }

  async loadPersonalDataAgreementText() {
  }

  setCurrentStep(step: number) {
    if (step >= 0 && step < this.steps.length) {
      // При переходе по степперу используем кеш
      this.useCache = true;
      this.currentStep = step;
    }
  }

  setDigitalSignature(signed: boolean) {
    this.isDigitallySigned = signed;
    this.digitalSignatureDate = signed ? new Date() : null;

    if (signed) {
      this.showSnackbar(i18n.t("rootStore.success.documentsSignedEDS"), "success");
    }
  }

  // Метод для установки состояния загрузки
  setIsLoading(loading: boolean) {
    this.isLoading = loading;
  }

  // Управление диалогом выхода
  setShowExitDialog(show: boolean) {
    this.showExitDialog = show;
  }

  // Подтверждение выхода
  confirmExit() {
    this.showExitDialog = false;
    this.useCache = false;
    // Очищаем данные при выходе
    this.clearApplicationData();
  }

  // Отмена выхода
  cancelExit() {
    this.showExitDialog = false;
  }

  // Очистка данных приложения
  clearApplicationData() {
    // Очищаем только данные заявки, но не справочники
    this.applicationId = 0;
    this.service_id = 0;
    this.deadline = null;
    this.number = "";
    this.comment = "";
    this.applicationStatus = null;
    this.applicationNumber = "";
    this.isDigitallySigned = false;
    this.digitalSignatureDate = null;
    this.statusId = 0;
    this.statusName = 0;
    this.companyId = 0;
  }

  async nextStep() {
    // При переходе вперед не используем кеш для новых данных
    this.useCache = false;

    // Validate current step before proceeding
    let canProceed = true;

    switch (this.currentStep) {
      case 0: // Objects
        break;
      case 1: // Participants
        break;
      case 2: // Documents
        break;
      case 3: // Review
        break;
    }

    if (canProceed && this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      window.history.replaceState(
        null,
        "",
        `/user/ApplicationStepper?id=${this.applicationId}&tab=${this.currentStep}`
      );
      window.scrollTo(0, 0);
    }
  }

  previousStep() {
    // При переходе назад используем кеш
    if (this.currentStep == 1) {
      this.useCache = true;
    } else {
      this.useCache = false;
    }

    if (this.currentStep > 0) {
      this.currentStep--;
      window.history.replaceState(
        null,
        "",
        `/user/ApplicationStepper?id=${this.applicationId}&tab=${this.currentStep}&back=1`
      );
      window.scrollTo(0, 0);
    }
  }

  setStep(stepIndex: number) {
    if (stepIndex >= 0 && stepIndex !== this.currentStep) {
      // При клике по степперу используем кеш
      this.useCache = true;

      this.currentStep = stepIndex;
      window.history.replaceState(
        null,
        "",
        `/user/ApplicationStepper?id=${this.applicationId}&tab=${this.currentStep}`
      );
      window.scrollTo(0, 0);
    }
  }

  async saveApplication() {
    this.isLoading = true;
  }

  async setCompanyIdToApplication() {
    this.isLoading = true;
  }

  async sendToBga() {
    // First check application validity
    const validation = await this.validateApplicationBeforeSend();
    if (!validation.isValid) {
      this.showSnackbar(validation.message || i18n.t("rootStore.error.applicationValidationFailed"), "error");
      return false;
    }

    this.isLoading = true;
  }

  async validateApplicationBeforeSend(): Promise<{ isValid: boolean; message?: string }> {
    let validationResult = { isValid: true, message: "" };

    this.isLoading = true;
    return validationResult;
  }

  showSnackbar(message: string, severity: SnackbarSeverity = "info") {
    this.snackbar = {
      open: true,
      message,
      severity,
    };
  }

  closeSnackbar() {
    this.snackbar.open = false;
  }

  reset() {
    this.applicationStatus = null;
    this.isLoading = false;
    this.isDigitallySigned = false;
    this.digitalSignatureDate = null;
    this.clearApplicationData();
  }

  startNewApplication() {
    this.reset();
    window.history.replaceState(null, "", "/user/ApplicationStepper?id=0");
    this.showSnackbar(i18n.t("rootStore.success.newApplicationStarted"), "info");
  }

  get canNavigateNext(): boolean {
    return !this.isLoading && this.currentStep < this.steps.length - 1;
  }

  get canNavigateBack(): boolean {
    return !this.isLoading && this.currentStep > 0;
  }

  get isLastStep(): boolean {
    return this.currentStep === this.steps.length - 1;
  }

  get isFirstStep(): boolean {
    return this.currentStep === 0;
  }

  get isObjectStep(): boolean {
    return this.currentStep === 0;
  }

  get isCustomerStep(): boolean {
    return this.currentStep === 1;
  }

  get isDocumentsStep(): boolean {
    return this.currentStep === 2;
  }

  get isPrintStep(): boolean {
    return this.currentStep === 3;
  }

  get isReadyToSubmit(): boolean {
    return this.isDigitallySigned;
  }
  // В файле RootStore.ts, примерно строка 220
  canNavigateToStep(stepIndex: number): boolean {
    // Если переходим на текущий шаг - разрешаем
    if (stepIndex === this.currentStep) {
      return true;
    }

    // Можно перейти только на предыдущие шаги
    // Вперед можно идти только через кнопку "Далее" с валидацией
    if (stepIndex > this.currentStep) {
      // Если есть ID заявки - можем переходить вперед по степперу
      if (this.applicationId > 0) {
        return true;
      }
      return false;
    }

    // Нельзя перейти, если нет ID заявки (кроме первого шага)
    if (stepIndex > 0 && this.applicationId === 0) {
      return false;
    }

    return true;
  }
}

// Create singleton instance
export const rootStore = new RootStore();

// For debugging in development
if (process.env.NODE_ENV === "development") {
  (window as any).rootStore = rootStore;
}