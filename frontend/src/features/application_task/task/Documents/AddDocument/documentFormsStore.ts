// documentFormsStore.js
import { makeAutoObservable, runInAction, toJS } from "mobx";
import MainStore from "MainStore";
import i18n from "i18next";
import { getorg_structure, getorg_structures } from "api/org_structure";
import { getStructurePosts } from "api/StructurePost/useGetStructurePosts";
import {
  getApplicationDocuments,
  getApplicationDocumentsByServiceId,
} from "api/ApplicationDocument/useGetApplicationDocuments";
import { completeStep } from "api/ApplicationWorkDocument/documentsApi";
import { applyDocumentApproval, createDocumentApproval } from "api/ApplicationDocument/useCreateApplicationDocument";
import storeForm from '../store';

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
  signersDraft: Record<number, any[]> = {};
  nextTempId = -1;

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

  getTempId() {
    return this.nextTempId--;
  }

  addSignerLocal(stepId: number, signer: any) {
    if (!this.signersDraft[stepId]) return;

    this.signersDraft[stepId].push({
      id: this.getTempId(),
      status: 'waiting',
      department_id: signer.department_id,
      department_name: this.departments.find(d => d.id === signer.department_id)?.name,
      position_id: signer.position_id,
      position_name: this.positions.find(p => p.id === signer.position_id)?.name,
      order_number: signer.order_number,
      is_required: signer.is_required,
      comments: signer.comments,
      is_final: signer.is_final,
    });
  }

  changeApproverOrder(stepId: number, approverId: number, newOrder: number) {
    const a = this.signersDraft[stepId]?.find(x => x.id === approverId);
    if (a) a.order_number = newOrder;
  }

  removeApprover(stepId: number, approverId: number) {
    this.signersDraft[stepId] =
      (this.signersDraft[stepId] ?? []).map(x => {
        if (x.id === approverId) {
          if (x.id > 0) {
            return {
              ...x,
              status: "is_deleted"
            };
          }
          return null;
        }
        return x;
      }).filter(Boolean) as any[];
  }

  toggleApproverRequired(stepId: number, approverId: number, value: boolean) {
    const a = this.signersDraft[stepId]?.find(x => x.id === approverId);
    if (a) a.is_required = value;
  }

  initSignersDraft(stepId: number) {
    const step = storeForm.data.find(x => x.id === stepId);
    const approvals = step?.documents?.[0]?.approvals ?? [];

    this.signersDraft[stepId] = approvals.map(a => ({ ...a }));
    this.nextTempId = -1;
  }

  discardSignersDraft(stepId: number) {
    delete this.signersDraft[stepId];
  }

  async applySignersDraft(stepId: number, onSuccess: () => void) {
    const step = storeForm.data.find(x => x.id === stepId);
    if (!step || !step.documents?.[0]) return;
    try {
      MainStore.changeLoader(true);
      const response = await applyDocumentApproval(stepId, this.currentDocumentId, this.signersDraft[stepId]);
      if (response.status === 200) {
        MainStore.setSnackbar("Документ успешно добавлен", "success");
        this.closeSignerDialog();
        delete this.signersDraft[stepId];
        onSuccess()
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
    // console.log(toJS(this.signersDraft[stepId] ?? []));
  }

  setFinalApprover(stepId: number, approverId: number) {
    const list = this.signersDraft[stepId] ?? [];
    if (!list.length) return;

    const maxOrder =
      Math.max(...list.map(x => x.order_number ?? 0)) + 1;

    this.signersDraft[stepId] = list.map(x => {
      if (x.id === approverId) {
        return {
          ...x,
          is_final: true,
          order_number: maxOrder
        };
      }

      return {
        ...x,
        is_final: false
      };
    });
  }
}

export default new DocumentFormsStore();
