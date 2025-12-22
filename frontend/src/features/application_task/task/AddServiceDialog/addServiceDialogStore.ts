import { makeAutoObservable, runInAction } from "mobx";
import MainStore from "MainStore";
import i18n from "i18next";
import {
  addStepsFromService,
  getAdditionalServicesByApplicationId,
} from "api/ApplicationAdditionalService/applicationAdditionalServiceApi";
import { getServicesForAdding, getServiceSteps } from "api/Service/useGetServices";
import {
  ApplicationAdditionalService,
  ServiceForAdding,
  ServiceStep,
} from "types/ApplicationAdditionalService";

class AddServiceDialogStore {
  // Состояние диалога
  isOpen = false;
  isLoading = false;
  isSubmitting = false;

  // Данные заявки
  applicationId: number | null = null;
  currentStepId: number | null = null;
  currentStepOrderNumber: number | null = null;

  // Списки для выбора
  availableServices: ServiceForAdding[] = [];
  serviceSteps = [];
  service_path_id = 0;

  // Форма
  selectedServiceId: number | null = null;
  insertAfterStepId: number | null = null;
  addReason: string = "";

  // Валидация
  errors = {
    service: "",
    reason: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * Открыть диалог
   * @param applicationId - ID заявки
   * @param currentStepId - ID текущего шага
   * @param currentStepOrderNumber - Порядковый номер текущего шага
   */
  openDialog = async (
    applicationId: number,
    currentStepId: number,
    currentStepOrderNumber: number
  ) => {
    this.applicationId = applicationId;
    this.currentStepId = currentStepId;
    this.currentStepOrderNumber = currentStepOrderNumber;
    this.insertAfterStepId = currentStepId; // По умолчанию вставляем после текущего
    this.isOpen = true;

    // Загружаем доступные услуги
    await this.loadAvailableServices();
  };

  /**
   * Закрыть диалог
   */
  closeDialog = () => {
    this.isOpen = false;
    this.resetForm();
  };

  /**
   * Сбросить форму
   */
  resetForm = () => {
    this.selectedServiceId = null;
    this.insertAfterStepId = this.currentStepId;
    this.addReason = "";
    this.serviceSteps = [];
    this.errors = {
      service: "",
      reason: "",
    };
  };

  /**
   * Загрузить список доступных услуг
   */
  loadAvailableServices = async () => {
    try {
      this.isLoading = true;
      MainStore.changeLoader(true);

      const response = await getServicesForAdding();

      if (response.status === 200 && response.data) {
        runInAction(() => {
          this.availableServices = response.data;
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки услуг:", error);
      MainStore.openErrorDialog("Не удалось загрузить список услуг")
    } finally {
      runInAction(() => {
        this.isLoading = false;
        MainStore.changeLoader(false);
      });
    }
  };

  /**
   * Выбрать услугу и загрузить её шаги
   */
  selectService = async (serviceId: number) => {
    this.selectedServiceId = serviceId;
    this.errors.service = "";

    try {
      this.isLoading = true;

      const response = await getServiceSteps(serviceId);

      if (response.status === 200 && response.data) {
        runInAction(() => {
          this.serviceSteps = response.data.service_path?.steps;
          this.service_path_id = response.data.service_path?.id;
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки шагов услуги:", error);
      MainStore.openErrorDialog(
        "Не удалось загрузить шаги услуги"
      );
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  /**
   * Изменить причину добавления
   */
  setAddReason = (reason: string) => {
    this.addReason = reason;
    this.errors.reason = "";
  };

  /**
   * Валидация формы
   */
  validateForm = (): boolean => {
    let isValid = true;

    if (!this.selectedServiceId) {
      this.errors.service = "Выберите услугу";
      isValid = false;
    }

    if (!this.addReason || this.addReason.trim().length < 10) {
      this.errors.reason = "Укажите причину (минимум 10 символов)";
      isValid = false;
    }

    return isValid;
  };

  /**
   * Отправить форму
   */
  submitForm = async () => {
    if (!this.validateForm()) {
      return;
    }

    try {
      this.isSubmitting = true;
      MainStore.changeLoader(true);

      const requestData = {
        application_id: this.applicationId!,
        additional_service_path_id: this.service_path_id!,
        added_at_step_id: this.currentStepId!,
        insert_after_step_id: this.insertAfterStepId!,
        add_reason: this.addReason.trim(),
      };

      const response = await addStepsFromService(requestData);

      if (response.status === 200 || response.status === 201) {
        MainStore.openErrorDialog(
          "Шаги из услуги успешно добавлены"
        );

        this.closeDialog();

        // Обновляем страницу заявки
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Ошибка добавления шагов:", error);

      const errorMessage =
        error?.response?.data?.error ||
        "Не удалось добавить шаги из услуги";

      MainStore.openErrorDialog(errorMessage);
    } finally {
      runInAction(() => {
        this.isSubmitting = false;
        MainStore.changeLoader(false);
      });
    }
  };

  /**
   * Получить выбранную услугу
   */
  get selectedService(): ServiceForAdding | null {
    if (!this.selectedServiceId) return null;
    return (
      this.availableServices.find((s) => s.id === this.selectedServiceId) ||
      null
    );
  }

  /**
   * Можно ли отправить форму
   */
  get canSubmit(): boolean {
    return (
      !this.isSubmitting &&
      !!this.selectedServiceId &&
      this.addReason.trim().length >= 10
    );
  }


}

export default new AddServiceDialogStore();