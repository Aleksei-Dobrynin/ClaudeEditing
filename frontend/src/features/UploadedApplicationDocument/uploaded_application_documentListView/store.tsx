// Путь: frontend/src/features/UploadedApplicationDocument/uploaded_application_documentListView/store.tsx
// ЗАМЕНИТЬ ФАЙЛ ПОЛНОСТЬЮ

import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { acceptuploaded_application_document, deleteuploaded_application_document, uploadTemplate } from "api/uploaded_application_document";
import { getuploaded_application_documentsBy } from "api/uploaded_application_document";
import { downloadFile, getSignByFileId } from "api/File";
import { getFilledTemplateByCode } from "api/org_structure";
import { callOutSignFile, getAvailableSigningRoles, callOutSignFileById } from "api/FileSign";
import { AvailableSigningRole } from "constants/SigningRole";

class NewStore {
  data = [];
  signData = [];
  incomingData = [];
  outgoingData = [];
  openPanel = false;
  openPanelNew = false;
  openPanelAttachFromOtherDoc = false;
  idDocumentAttach = 0;
  step_id = 0;
  onUploadSaved = null;
  File = null;
  fileType = '';
  fileUrl = null;
  isOpenFileView = false;
  ecpListOpen = false;
  docPreviewOpen = false;
  htmlContent = "";
  currentTemplateCode = "";
  currentId = 0;
  idMain = 0;
  isEdit = false;
  service_document_id = 0;
  uploadedDocId = 0;

  // ========== НОВЫЕ ПОЛЯ ДЛЯ РАБОТЫ С РОЛЯМИ ==========
  
  /** Список доступных ролей для текущего пользователя */
  availableRoles: AvailableSigningRole[] = [];
  
  /** Выбранная роль для подписания/отзыва */
  selectedRole: AvailableSigningRole | null = null;
  
  /** Открыт ли диалог выбора роли */
  roleSelectionDialogOpen: boolean = false;
  
  /** Режим диалога: 'sign' - подписание, 'revoke' - отзыв */
  roleDialogMode: 'sign' | 'revoke' = 'sign';
  
  /** ID файла для текущей операции */
  currentFileIdForSigning: number | null = null;
  
  /** ID загруженного документа для текущей операции */
  currentUplIdForSigning: number | null = null;
  
  /** Callback для вызова после успешной операции */
  currentOnSuccessCallback: (() => void) | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  onEditClicked(id: number) {
    this.openPanel = true;
    this.currentId = id;
  }

  closePanel() {
    this.openPanel = false;
    this.currentId = 0;
    this.service_document_id = 0;
  }

  onEditNewClicked(id: number) {
    this.openPanelNew = true;
    this.currentId = id;
  }
  
  closeNewPanel() {
    this.openPanelNew = false;
    this.currentId = 0;
  }

  closePanelAttach() {
    this.openPanelAttachFromOtherDoc = false;
    this.idDocumentAttach = 0;
    this.currentId = 0;
  }
  
  attachClicked(idDocument: number, service_document_id: number, uploadedDocId: number) {
    this.openPanelAttachFromOtherDoc = true;
    this.idDocumentAttach = idDocument;
    this.service_document_id = service_document_id;
    this.uploadedDocId = uploadedDocId;
  }

  // ============ ОБНОВЛЕННЫЕ МЕТОДЫ ПОДПИСАНИЯ ============

  /**
   * @deprecated Используйте openRoleSelectionForSigning
   * Метод оставлен для обратной совместимости
   */
  signApplicationPayment(fileId: number, uplId: number, onSaved: () => void) {
    // Перенаправляем на новый метод с выбором ролей
    this.openRoleSelectionForSigning(fileId, uplId, onSaved);
  }

  /**
   * @deprecated Используйте openRoleSelectionForRevoke
   * Метод оставлен для обратной совместимости
   */
  async callOutSignApplicationPayment(fileId: number, onSaved: () => void) {
    // Перенаправляем на новый метод с выбором ролей
    this.openRoleSelectionForRevoke(fileId, onSaved);
  }

  // ============ НОВЫЕ МЕТОДЫ ДЛЯ РАБОТЫ С РОЛЯМИ ============

  /**
   * Открыть диалог выбора роли для подписания
   * @param fileId - ID файла
   * @param uplId - ID загруженного документа
   * @param onSaved - Callback после успешного подписания
   */
  async openRoleSelectionForSigning(fileId: number, uplId: number, onSaved: () => void) {
    try {
      MainStore.changeLoader(true);
      const response = await getAvailableSigningRoles(fileId);
      
      runInAction(() => {
        this.availableRoles = response.data || [];
        this.currentFileIdForSigning = fileId;
        this.currentUplIdForSigning = uplId;
        this.currentOnSuccessCallback = onSaved;
        this.roleDialogMode = 'sign';
        
        // Фильтруем только активные роли
        const activeRoles = this.availableRoles.filter(r => r.isActive);
        
        // Если только одна активная роль - автоматически выбираем и подписываем
        if (activeRoles.length === 1) {
          this.selectedRole = activeRoles[0];
          this.proceedToSign();
        } else if (activeRoles.length > 1) {
          // Если несколько ролей - показываем диалог выбора
          this.roleSelectionDialogOpen = true;
          // Автоматически выбираем первую неподписанную роль
          this.selectedRole = activeRoles.find(r => !r.alreadySigned) || activeRoles[0];
        } else {
          MainStore.setSnackbar(i18n.t("У вас нет активных ролей для подписания"), "warning");
        }
      });
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  /**
   * Открыть диалог выбора роли для отзыва подписи
   * @param fileId - ID файла
   * @param onSaved - Callback после успешного отзыва
   */
  async openRoleSelectionForRevoke(fileId: number, onSaved: () => void) {
    try {
      MainStore.changeLoader(true);
      const response = await getAvailableSigningRoles(fileId);
      
      runInAction(() => {
        this.availableRoles = response.data || [];
        this.currentFileIdForSigning = fileId;
        this.currentOnSuccessCallback = onSaved;
        this.roleDialogMode = 'revoke';
        
        // Фильтруем только подписанные роли
        const signedRoles = this.availableRoles.filter(r => r.alreadySigned);
        
        // Если только одна подпись - автоматически отзываем
        if (signedRoles.length === 1) {
          this.selectedRole = signedRoles[0];
          this.proceedToRevoke();
        } else if (signedRoles.length > 1) {
          // Если несколько подписей - показываем диалог выбора
          this.roleSelectionDialogOpen = true;
          this.selectedRole = signedRoles[0]; // Выбираем первую
        } else {
          MainStore.setSnackbar(i18n.t("У вас нет подписей для отзыва"), "warning");
        }
      });
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  /**
   * Закрыть диалог выбора роли
   */
  closeRoleSelectionDialog() {
    this.roleSelectionDialogOpen = false;
    this.selectedRole = null;
    this.currentFileIdForSigning = null;
    this.currentUplIdForSigning = null;
    this.currentOnSuccessCallback = null;
    this.availableRoles = [];
  }

  /**
   * Установить выбранную роль
   */
  setSelectedRole(role: AvailableSigningRole) {
    this.selectedRole = role;
  }

  /**
   * Проверить, есть ли другие подписанные роли
   */
  hasAlreadySignedWithAnotherRole(): AvailableSigningRole | null {
    if (!this.selectedRole) return null;
    
    return this.availableRoles.find(r => 
      r.alreadySigned && 
      r.structureEmployeeId !== this.selectedRole?.structureEmployeeId
    ) || null;
  }

  /**
   * Продолжить подписание с выбранной ролью
   */
  proceedToSign() {
    if (!this.selectedRole || !this.currentFileIdForSigning || !this.currentUplIdForSigning) {
      return;
    }

    // Проверяем, не подписана ли уже другая роль
    const anotherSignedRole = this.hasAlreadySignedWithAnotherRole();
    
    if (anotherSignedRole) {
      // Показываем предупреждение через confirm
      const confirmed = window.confirm(
        `Вы уже подписали этот документ как ${anotherSignedRole.positionName} (${anotherSignedRole.departmentName}).\n\n` +
        `Вы уверены, что хотите подписать его также как ${this.selectedRole.positionName} (${this.selectedRole.departmentName})?`
      );
      
      if (!confirmed) {
        return; // Пользователь отменил
      }
    }

    // Закрываем диалог выбора роли
    this.closeRoleSelectionDialog();
    
    const fileId = this.currentFileIdForSigning;
    const uplId = this.currentUplIdForSigning;
    const positionId = this.selectedRole.positionId;
    const departmentId = this.selectedRole.departmentId;
    const onSuccess = this.currentOnSuccessCallback;
    
    // Открываем стандартный диалог ЭЦП с выбранной ролью
    MainStore.digitalSign.fileId = fileId;
    MainStore.digitalSign.uplId = uplId;
    MainStore.digitalSign.selectedPositionId = positionId;
    MainStore.digitalSign.selectedDepartmentId = departmentId;
    
    MainStore.openDigitalSign(
      fileId,
      async () => {
        MainStore.onCloseDigitalSign();
        if (onSuccess) {
          onSuccess();
        }
      },
      () => MainStore.onCloseDigitalSign(),
      positionId,
      departmentId
    );
  }

  /**
   * Продолжить отзыв подписи для выбранной роли
   */
  async proceedToRevoke() {
    if (!this.selectedRole?.fileSignId) {
      MainStore.setSnackbar(i18n.t("Ошибка: не найден ID подписи"), "error");
      return;
    }

    try {
      MainStore.changeLoader(true);
      const response = await callOutSignFileById(this.selectedRole.fileSignId);
      
      if (response.status === 201 || response.status === 200) {
        MainStore.setSnackbar(i18n.t("message:snackbar.successDelete"), "success");
        
        // Закрываем диалог
        this.closeRoleSelectionDialog();
        
        // Вызываем callback
        if (this.currentOnSuccessCallback) {
          this.currentOnSuccessCallback();
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  /**
   * Обработчик подтверждения в диалоге выбора роли
   */
  handleRoleDialogConfirm() {
    if (this.roleDialogMode === 'sign') {
      this.proceedToSign();
    } else {
      this.proceedToRevoke();
    }
  }

  // ============ ОСТАЛЬНЫЕ МЕТОДЫ (БЕЗ ИЗМЕНЕНИЙ) ============

  setFastInputIsEdit = (value: boolean) => {
    this.isEdit = value;
  }

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

        const mimeType = response.data.contentType || 'application/octet-stream';
        const fileNameBack = response.data.fileDownloadName;

        let url = "";

        if (fileNameBack.endsWith('.jpg') || fileNameBack.endsWith('.jpeg') || fileNameBack.endsWith('.png')) {
          const newWindow = window.open();
          if (newWindow) {
            const blob = new Blob([byteArray], { type: mimeType });
            url = window.URL.createObjectURL(blob);
            newWindow.document.write(`<img src="${url}" />`);
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            console.error('Не удалось открыть новое окно. Возможно, оно было заблокировано.');
          }
        } else if (fileNameBack.endsWith('.pdf')) {
          const newWindow = window.open();
          if (newWindow) {
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            url = window.URL.createObjectURL(blob);
            newWindow.location.href = url;
            setTimeout(() => window.URL.revokeObjectURL(url), 1000);
          } else {
            console.error('Не удалось открыть новое окно. Возможно, оно было заблокировано.');
          }
        }

        const blob = new Blob([byteArray], { type: mimeType });
        url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', response.data.fileDownloadName || fileName);
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

  checkFile(fileName: string) {
    return (fileName.toLowerCase().endsWith('.jpg') ||
      fileName.toLowerCase().endsWith('.jpeg') ||
      fileName.toLowerCase().endsWith('.png') ||
      fileName.toLowerCase().endsWith('.pdf'));
  }

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

  uploadFile(service_document_id: number, upload_id: number, step_id?: number, onUploadSaved?: () => void) {
    this.service_document_id = service_document_id;
    this.currentId = upload_id;
    this.openPanel = true;
    this.step_id = step_id;
    this.onUploadSaved = onUploadSaved;
  }

  async loaduploaded_application_documents() {
    try {
      MainStore.changeLoader(true);
      const response = await getuploaded_application_documentsBy(this.idMain);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.data = response.data;
        const out_doc = response.data.filter(el => el.is_outcome === true);
        this.outgoingData = out_doc;
        const inc_doc = response.data.filter(el => el.is_outcome === false || el.is_outcome === null);
        this.incomingData = inc_doc.filter(el => el.type_code !== "cabinet" || (el.file_id != null && el.type_code === "cabinet"));
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
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
  }

  async uploadHtmlString(code) {
    try {
      MainStore.changeLoader(true);
      const response = await uploadTemplate({ html: this.htmlContent, application_id: this.idMain, template_code: code });
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.docPreviewOpen = false;
        this.loaduploaded_application_documents();
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async getHtmlTemplate(templateCode: string, parameters: {}, lang?: string) {
    try {
      MainStore.changeLoader(true);
      const response = await getFilledTemplateByCode(templateCode, lang ?? "ru", parameters);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.htmlContent = response.data;
        this.docPreviewOpen = true;
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  deleteuploaded_application_document(id: number) {
    MainStore.openErrorConfirm(
      i18n.t("areYouSure"),
      i18n.t("delete"),
      i18n.t("no"),
      async () => {
        try {
          MainStore.changeLoader(true);
          const response = await deleteuploaded_application_document(id);
          if (response.status === 201 || response.status === 200) {
            this.loaduploaded_application_documents();
            MainStore.setSnackbar(i18n.t("message:snackbar.successSave"));
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
      () => MainStore.onCloseConfirm()
    );
  }

  async rejectDocument(upl_id: number) {
    try {
      MainStore.changeLoader(true);
      let response;
      response = await deleteuploaded_application_document(upl_id);
      if (response.status === 201 || response.status === 200) {
        this.loaduploaded_application_documents();
        MainStore.setSnackbar(i18n.t("message:snackbar.successDelete"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  async acceptDocumentWithoutFile(serDoc: number) {
    var data = {
      id: 0,
      file_id: 0,
      application_document_id: this.idMain,
      name: "",
      service_document_id: serDoc,
      created_at: null,
      updated_at: null,
      created_by: 0,
      updated_by: 0,
      document_number: ""
    };
    try {
      MainStore.changeLoader(true);
      let response;
      response = await acceptuploaded_application_document(data);
      if (response.status === 201 || response.status === 200) {
        this.loaduploaded_application_documents();
        MainStore.setSnackbar(i18n.t("message:snackbar.successSave"), "success");
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    } finally {
      MainStore.changeLoader(false);
    }
  }

  clearStore() {
    runInAction(() => {
      this.data = [];
      this.signData = [];
      this.currentId = 0;
      this.openPanel = false;
      this.idMain = 0;
      this.isEdit = false;
      this.openPanelNew = false;
      
      // Очистка новых полей
      this.availableRoles = [];
      this.selectedRole = null;
      this.roleSelectionDialogOpen = false;
      this.roleDialogMode = 'sign';
      this.currentFileIdForSigning = null;
      this.currentUplIdForSigning = null;
      this.currentOnSuccessCallback = null;
    });
  }
}

export default new NewStore();