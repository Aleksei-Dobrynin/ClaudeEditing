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
      case 0: // Objects
        if (!this.service_id) {
          errors.push(i18n.t("message:error.required_field", { field: i18n.t("label:ApplicationAddEditView.service_id") }));
          isValid = false;
        }
        break;

      case 1: // Participants
        // Validation handled by ApplicationStore
        break;

      case 2: // Documents
        // Check if required documents are uploaded
        break;

      case 3: // Review
        if (!this.isDigitallySigned) {
          errors.push(i18n.t("message:error.signature_required"));
          isValid = false;
        }
        break;
    }

    return { isValid, errors };
  }

  async nextStep() {
    // Validate current step before proceeding
    const validation = this.validateStep(this.currentStep);
    
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        this.showSnackbar(error, "error");
      });
      return;
    }

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

  async saveApplication() {
    this.isLoading = true;
    try {
      // Save implementation
      this.showSnackbar(i18n.t("message:success.saved"), "success");
    } catch (error) {
      this.showSnackbar(i18n.t("message:error.save_failed"), "error");
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
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

  async sendToBga() {
    // First check application validity
    const validation = await this.validateApplicationBeforeSend();
    if (!validation.isValid) {
      this.showSnackbar(validation.message || i18n.t("message:error.validation_failed"), "error");
      return false;
    }

    this.isLoading = true;
    try {
      // Send implementation
      this.showSnackbar(i18n.t("message:success.sent"), "success");
      return true;
    } catch (error) {
      this.showSnackbar(i18n.t("message:error.send_failed"), "error");
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async validateApplicationBeforeSend(): Promise<{ isValid: boolean; message?: string }> {
    let validationResult = { isValid: true, message: "" };

    this.isLoading = true;
    try {
      // Validate all steps
      const stepsCount = this.steps?.length || 4;
      for (let i = 0; i < stepsCount; i++) {
        const stepValidation = this.validateStep(i);
        if (!stepValidation.isValid) {
          validationResult = {
            isValid: false,
            message: i18n.t("message:error.step_validation_failed", { step: i18n.t(this.steps?.[i] || "") })
          };
          break;
        }
      }
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
    
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
    this.stepProgress = { 0: 0, 1: 0, 2: 0, 3: 0 };
  }

  startNewApplication() {
    this.reset();
    window.history.replaceState(null, "", "/user/ApplicationStepper?id=0");
    this.showSnackbar(i18n.t("message:info.new_started"), "info");
  }

  get canNavigateNext(): boolean {
    return !this.isLoading && this.currentStep < (this.steps?.length || 4) - 1;
  }

  get canNavigateBack(): boolean {
    // Disable back button during loading or on first step
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

  get isReadyToSubmit(): boolean {
    return (
      this.isDigitallySigned &&
      this.getTotalProgress() === 100
    );
  }

  get currentStepName(): string {
    if (!this.steps || !this.steps[this.currentStep]) {
      return "";
    }
    return i18n.t(this.steps[this.currentStep]);
  }
}

// Create singleton instance
export const rootStore = new RootStore();

// For debugging in development
if (process.env.NODE_ENV === "development") {
  (window as any).rootStore = rootStore;
}