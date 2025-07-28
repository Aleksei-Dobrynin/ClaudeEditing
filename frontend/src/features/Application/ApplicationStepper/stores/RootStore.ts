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

  async nextStep() {
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
      window.scrollTo(0, 0); // Scroll to top when changing steps
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
      window.scrollTo(0, 0);
    }
  }

  setStep(stepIndex: number) {
    if (stepIndex >= 0) {
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
      this.showSnackbar(validation.message || i18n.t("rootStore.error.applicationValidationFailed"));
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
    // Disable back button during loading or on first step
    return !this.isLoading && this.currentStep > 0;
  }

  get isLastStep(): boolean {
    return this.currentStep === this.steps.length - 1;
  }

  get isObjectStep(): boolean {
    return this.currentStep === 0;
  }

  get isCustomerStep(): boolean {
    return this.currentStep === 1;
  }

  get isPrintStep(): boolean {
    return this.currentStep === 4;
  }

  get isReadyToSubmit(): boolean {
    return (
      this.isDigitallySigned
    );
  }
}

// Create singleton instance
export const rootStore = new RootStore();

// For debugging in development
if (process.env.NODE_ENV === "development") {
  (window as any).rootStore = rootStore;
}