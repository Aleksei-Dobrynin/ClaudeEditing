// documentFormsStore.js
import { makeAutoObservable, runInAction } from "mobx";
import MainStore from "MainStore";
import i18n from "i18next";
import { getorg_structure, getorg_structures } from "api/org_structure";
import { getStructurePosts } from "api/StructurePost/useGetStructurePosts";
import {
  getApplicationDocuments,
  getApplicationDocumentsByServiceId,
} from "api/ApplicationDocument/useGetApplicationDocuments";
import { completeStep } from "api/ApplicationWorkDocument/documentsApi";
import { createDocumentApproval } from "api/ApplicationDocument/useCreateApplicationDocument";

class DocumentFormsStore {
  // Диалоги
  documentDialogOpen = false;
  signerDialogOpen = false;
  currentDocumentId = null;

  // Формы
  documentForm = {
    documentTypeId: 0,
    departmentId: 0,
    positionId: 0,
  };

  signerForm = {
    departmentId: 0,
    positionId: 0,
  };

  // Справочники
  documentTypes = [];
  departments = [];
  positions = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Document Dialog
  openDocumentDialog(service_id: number) {
    this.documentDialogOpen = true;
    this.resetDocumentForm();
    this.loadDocuments(service_id);
    this.loadOrgStructures();
    this.loadPositions();
  }

  closeDocumentDialog() {
    this.documentDialogOpen = false;
    this.resetDocumentForm();
  }

  resetDocumentForm() {
    this.documentForm = {
      documentTypeId: 0,
      departmentId: 0,
      positionId: 0,
    };
  }

  setDocumentFormField(field, value) {
    this.documentForm[field] = value;
  }

  loadDocuments = async (service_id: number) => {
    try {
      MainStore.changeLoader(true);
      const response = await getApplicationDocumentsByServiceId(service_id);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.documentTypes = response.data;
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

  loadOrgStructures = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getorg_structures();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.departments = response.data;
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

  loadPositions = async () => {
    try {
      MainStore.changeLoader(true);
      const response = await getStructurePosts();
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          this.positions = response.data;
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

  get isDocumentFormValid() {
    return (
      this.documentForm.documentTypeId &&
      this.documentForm.departmentId &&
      this.documentForm.positionId
    );
  }

  // Signer Dialog
  openSignerDialog(documentTypeId) {
    this.signerDialogOpen = true;
    this.currentDocumentId = documentTypeId;
    this.resetSignerForm();
    this.loadOrgStructures();
    this.loadPositions();
  }

  closeSignerDialog() {
    this.signerDialogOpen = false;
    this.currentDocumentId = null;
    this.resetSignerForm();
  }

  resetSignerForm() {
    this.signerForm = {
      departmentId: 0,
      positionId: 0,
    };
  }

  setSignerFormField(field, value) {
    this.signerForm[field] = value;
  }

  get isSignerFormValid() {
    return this.signerForm.departmentId && this.signerForm.positionId;
  }

  async addDocument(stepId: number, onSuccess: () => void) {
    if (!this.isDocumentFormValid) return;
    try {
      MainStore.changeLoader(true);
      const response = await createDocumentApproval(
        this.documentForm.departmentId,
        this.documentForm.positionId,
        stepId,
        this.documentForm.documentTypeId
      );
      if (response.status === 200) {
        MainStore.setSnackbar("Документ успешно добавлен", "success");
        this.closeDocumentDialog();
        onSuccess()
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async addSigner(stepId: number, onSuccess: () => void) {
    if (!this.isSignerFormValid) return;

    try {
      MainStore.changeLoader(true);
      const response = await createDocumentApproval(
        this.signerForm.departmentId,
        this.signerForm.positionId,
        stepId,
        this.currentDocumentId
      );
      if (response.status === 200) {
        MainStore.setSnackbar("Документ успешно добавлен", "success");
        this.closeSignerDialog();
        onSuccess()
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async deleteDocument(documentId) {
    MainStore.openErrorConfirm(
      "Вы уверены, что хотите удалить документ?",
      "Удалить",
      "Отмена",
      async () => {
        try {
          MainStore.changeLoader(true);

          // Здесь будет вызов API
          // await api.deleteStepDocument(documentId);

          // Имитация успешного ответа
          await new Promise((resolve) => setTimeout(resolve, 500));

          MainStore.setSnackbar("Документ удален", "success");

          // Обновить список документов
          // await parentStore.loadStepDocuments();
        } catch (error) {
          MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
        } finally {
          MainStore.changeLoader(false);
          MainStore.onCloseConfirm();
        }
      },
      () => MainStore.onCloseConfirm()
    );
  }

  async deleteSigner(documentId, signerId) {
    MainStore.openErrorConfirm(
      "Вы уверены, что хотите удалить подписанта?",
      "Удалить",
      "Отмена",
      async () => {
        try {
          MainStore.changeLoader(true);

          // Здесь будет вызов API
          // await api.deleteDocumentSigner(signerId);

          // Имитация успешного ответа
          await new Promise((resolve) => setTimeout(resolve, 500));

          MainStore.setSnackbar("Подписант удален", "success");

          // Обновить список документов
          // await parentStore.loadStepDocuments();
        } catch (error) {
          MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
        } finally {
          MainStore.changeLoader(false);
          MainStore.onCloseConfirm();
        }
      },
      () => MainStore.onCloseConfirm()
    );
  }
}

export default new DocumentFormsStore();
