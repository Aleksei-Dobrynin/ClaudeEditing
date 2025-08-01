import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";

export type SnackbarSeverity = "success" | "error" | "warning" | "info";

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}

export interface StepValidation {
  isValid: boolean;
  errors: string[];
}

export interface StepLoadingState {
  [key: number]: boolean;
}

export const ROUTES = {
  APPLICATION_LIST: '/user/Application',
  APPLICATION_STEPPER: '/user/ApplicationStepper',
  ERROR_404: '/error-404',
} as const;

export const STEP_NAMES = {
  OBJECT: 'label:ApplicationAddEditView.steps_objects',
  CUSTOMER: 'label:ApplicationAddEditView.steps_applicant', 
  DOCUMENTS: 'label:ApplicationAddEditView.steps_documents',
  REVIEW: 'label:ApplicationAddEditView.steps_review',
} as const;

export const STEP_INDICES = {
  OBJECT: 0,
  CUSTOMER: 1,
  DOCUMENTS: 2,
  REVIEW: 3,
} as const;

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
  
  // Progress tracking
  stepProgress: { [key: number]: number } = {
    0: 0, // Object step
    1: 0, // Customer step
    2: 0, // Documents step
    3: 0  // Print step
  };

  // Loading state for each step
  stepLoading: StepLoadingState = {
    0: false, // Object step
    1: false, // Customer step
    2: false, // Documents step
    3: false  // Print step
  };

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
    // Implementation
  }

  async loadPersonalDataAgreementText() {
    // Implementation
  }

  setCurrentStep(step: number) {
    if (step >= 0 && step < (this.steps?.length || 4)) {
      this.currentStep = step;
    }
  }

  setStepLoading(step: number, loading: boolean) {
    this.stepLoading[step] = loading;
    // Update global loading state based on any step loading
    this.isLoading = Object.values(this.stepLoading).some(Boolean);
  }

  setDigitalSignature(signed: boolean) {
    this.isDigitallySigned = signed;
    this.digitalSignatureDate = signed ? new Date() : null;

    if (signed) {
      this.showSnackbar(i18n.t("message:success.saved"), "success");
      this.updateStepProgress(3, 100);
    }
  }

  updateStepProgress(step: number, progress: number) {
    this.stepProgress[step] = Math.min(100, Math.max(0, progress));
  }

  getStepProgress(step: number): number {
    return this.stepProgress[step] || 0;
  }

  getTotalProgress(): number {
    const totalSteps = this.steps?.length || 4;
    const totalProgress = Object.values(this.stepProgress).reduce((sum, progress) => sum + progress, 0);
    return Math.round(totalProgress / totalSteps);
  }

  validateStep(stepIndex: number): StepValidation {
    const errors: string[] = [];
    let isValid = true;

    switch (stepIndex) {
      case 0: // Objects step
        if (!this.service_id) {
          errors.push("Услуга должна быть выбрана");
          isValid = false;
        }
        break;

      case 1: // Customer step - валидация происходит в ApplicationStore
        break;

      case 2: // Documents step - документы обычно не обязательны на этапе создания
        break;

      case 3: // Review step - цифровая подпись обязательна только для завершения
        if (!this.isDigitallySigned) {
          errors.push("Цифровая подпись обязательна для завершения заявки");
          isValid = false;
        }
        break;
    }

    return { isValid, errors };
  }

  // Валидация объектного шага
  validateObjectStep(ApplicationStore: any): StepValidation {
    const errors: string[] = [];
    let isValid = true;

    // Проверяем что услуга выбрана
    if (!ApplicationStore.service_id) {
      errors.push("Выберите услугу для продолжения");
      isValid = false;
    }

    // Проверяем ошибки валидации в ApplicationStore
    if (ApplicationStore.errorservice_id !== "") {
      errors.push("Исправьте ошибки в форме");
      isValid = false;
    }

    return { isValid, errors };
  }

  // Переход с объектного шага
  async handleObjectStepNext(ApplicationStore: any): Promise<boolean> {
    const validation = this.validateObjectStep(ApplicationStore);
    
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        this.showSnackbar(error, "error");
      });
      return false;
    }

    // Копируем service_id для последующего сохранения
    this.service_id = ApplicationStore.service_id;
    
    // Обновляем прогресс
    this.updateStepProgress(0, 100);
    
    return true;
  }

  // Переход с клиентского шага (с сохранением)
  async handleCustomerStepNext(ApplicationStore: any, navigate: any): Promise<boolean> {
    const needsSaving = this.applicationId === 0 || ApplicationStore.id === 0;
    
    if (!needsSaving) {
      // Заявка уже существует, просто переходим
      this.updateStepProgress(1, 100);
      return true;
    }

    // Валидируем данные клиента перед сохранением
    const customerValidation = this.validateCustomerData(ApplicationStore.customer);
    if (!customerValidation.isValid) {
      customerValidation.errors.forEach(error => {
        this.showSnackbar(error, "error");
      });
      return false;
    }

    this.setStepLoading(1, true);
    
    try {
      // Копируем данные из первого шага
      ApplicationStore.service_id = this.service_id;
      
      return new Promise<boolean>((resolve) => {
        ApplicationStore.onSaveClick((id: number) => {
          try {
            if (id > 0) {
              // Обновляем ID заявки
              this.applicationId = Number(id);
              
              // Обновляем URL с новым ID и переходим на шаг 2
              const newUrl = `/user/ApplicationStepper?id=${id}&tab=2`;
              navigate(newUrl, { replace: true });
              
              // Устанавливаем текущий шаг
              this.setCurrentStep(2);
              
              // Показываем успешное сообщение
              this.showSnackbar("Заявка успешно создана", "success");
              
              // Обновляем прогресс
              this.updateStepProgress(1, 100);
              
              // Загружаем данные заявки
              ApplicationStore.doLoad(id);
              
              resolve(true);
            } else {
              this.showSnackbar("Ошибка при создании заявки", "error");
              resolve(false);
            }
          } catch (error) {
            console.error("Error saving application:", error);
            this.showSnackbar("Ошибка при сохранении заявки", "error");
            resolve(false);
          } finally {
            this.setStepLoading(1, false);
          }
        });
      });
    } catch (error) {
      console.error("Error in handleCustomerStepNext:", error);
      this.showSnackbar("Ошибка при сохранении заявки", "error");
      this.setStepLoading(1, false);
      return false;
    }
  }

  // Переход с шага документов
  async handleDocumentsStepNext(): Promise<boolean> {
    // Логика валидации документов если нужна
    this.updateStepProgress(2, 100);
    return true;
  }

  // Завершение процесса на последнем шаге
  async handleFinalStep(navigate: any): Promise<boolean> {
    const validation = this.validateStep(3);
    
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        this.showSnackbar(error, "error");
      });
      return false;
    }

    this.updateStepProgress(3, 100);
    navigate(`/user/Application`);
    return true;
  }

  // Универсальный метод для перехода на следующий шаг
  async handleNextStep(ApplicationStore: any, navigate: any): Promise<boolean> {
    let success = false;

    if (this.isObjectStep) {
      success = await this.handleObjectStepNext(ApplicationStore);
      if (success) {
        this.nextStep();
      }
    } else if (this.isCustomerStep) {
      success = await this.handleCustomerStepNext(ApplicationStore, navigate);
      // Навигация уже происходит внутри handleCustomerStepNext
    } else if (this.isDocumentsStep) {
      success = await this.handleDocumentsStepNext();
      if (success) {
        this.nextStep();
      }
    } else if (this.isLastStep) {
      success = await this.handleFinalStep(navigate);
    } else {
      // Обычный переход
      this.nextStep();
      success = true;
    }

    return success;
  }

  async nextStep() {
    if (this.currentStep < (this.steps?.length || 4) - 1) {
      this.currentStep++;
      window.history.replaceState(
        null,
        "",
        `/user/ApplicationStepper?id=${this.applicationId}&tab=${this.currentStep}`
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      window.history.replaceState(
        null,
        "",
        `/user/ApplicationStepper?id=${this.applicationId}&tab=${this.currentStep}`
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  setStep(stepIndex: number) {
    if (stepIndex >= 0 && stepIndex < (this.steps?.length || 4)) {
      this.currentStep = stepIndex;
      window.history.replaceState(
        null,
        "",
        `/user/ApplicationStepper?id=${this.applicationId}&tab=${this.currentStep}`
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async setCompanyIdToApplication() {
    this.isLoading = true;
    try {
      // Implementation
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
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
    this.stepProgress = { 0: 0, 1: 0, 2: 0, 3: 0 };
    this.stepLoading = { 0: false, 1: false, 2: false, 3: false };
  }

  startNewApplication() {
    this.reset();
    window.history.replaceState(null, "", "/user/ApplicationStepper?id=0");
    this.showSnackbar("Создание новой заявки", "info");
  }

  get canNavigateNext(): boolean {
    return !this.isLoading && this.currentStep < (this.steps?.length || 4) - 1;
  }

  get canNavigateBack(): boolean {
    return !this.isLoading && this.currentStep > 0;
  }

  get isLastStep(): boolean {
    return this.currentStep === (this.steps?.length || 4) - 1;
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

  // Вспомогательные методы для работы с Customer (используя существующие поля)
  getCustomerName(customer: any): string {
    if (!customer) return "Не указано";
    
    if (customer.is_organization) {
      return customer.full_name || "Не указано";
    } else {
      const parts = [
        customer.individual_surname,
        customer.individual_name,
        customer.individual_secondname
      ].filter(Boolean);
      return parts.length > 0 ? parts.join(" ") : customer.full_name || "Не указано";
    }
  }

  getCustomerRegistrationNumber(customer: any): string {
    if (!customer) return "";
    
    if (customer.is_organization) {
      return customer.registration_number || "";
    } else {
      return customer.pin || "";
    }
  }

  getCustomerPhone(customer: any): string {
    if (!customer) return "";
    return customer.sms_1 || customer.sms_2 || "";
  }

  getCustomerEmail(customer: any): string {
    if (!customer) return "";
    return customer.email_1 || customer.email_2 || "";
  }

  // Валидация клиентских данных (используя существующие поля)
  validateCustomerData(customer: any): StepValidation {
    const errors: string[] = [];
    let isValid = true;

    if (!customer) {
      errors.push("Данные клиента не заполнены");
      return { isValid: false, errors };
    }

    // Обязательные поля
    if (!customer.pin) {
      errors.push("ПИН обязателен для заполнения");
      isValid = false;
    }

    if (customer.is_organization) {
      if (!customer.full_name) {
        errors.push("Название организации обязательно");
        isValid = false;
      }
      if (!customer.registration_number) {
        errors.push("Регистрационный номер организации обязателен");
        isValid = false;
      }
    } else {
      if (!customer.individual_surname) {
        errors.push("Фамилия обязательна для заполнения");
        isValid = false;
      }
      if (!customer.individual_name) {
        errors.push("Имя обязательно для заполнения");
        isValid = false;
      }
    }

    return { isValid, errors };
  }

  get isNewApplication(): boolean {
    return this.applicationId === 0;
  }

  get isReadyToSubmit(): boolean {
    return (
      this.service_id !== 0 &&
      this.isDigitallySigned
    );
  }

  get currentStepName(): string {
    if (!this.steps || !this.steps[this.currentStep]) {
      return "";
    }
    return i18n.t(this.steps[this.currentStep]);
  }

  get isCurrentStepLoading(): boolean {
    return this.stepLoading[this.currentStep] || false;
  }
}

// Create singleton instance
export const rootStore = new RootStore();

// For debugging in development
if (process.env.NODE_ENV === "development") {
  (window as any).rootStore = rootStore;
}