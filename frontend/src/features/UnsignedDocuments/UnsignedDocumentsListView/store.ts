import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import { GridSortModel } from "@mui/x-data-grid";
import { getUnsignedDocuments } from "api/ApplicationDocument/useGetApplicationDocument";

// Интерфейс для одного документа (строка в гриде)
export interface IUnsignedDocument {
  id: number; // уникальный id для грида (uploaded_document_id)
  uploaded_document_id: number;
  document_name: string;
  document_status: "pending" | "approved" | "rejected";
  app_id: number;
  app_number: string;
  app_work_description: string;
  arch_object_address: string;
  full_name: string;
  pin: string;
  service_name: string;
  service_days: number;
  deadline: string;
  task_id: number;
  app_step_id: number;
}

// Интерфейс фильтра
export interface IUnsignedDocumentsFilter {
  searchTerm: string;
  showOverdue: boolean;
  showPending: boolean;
  showApproved: boolean;
  showRejected: boolean;
}

class UnsignedDocumentsStore {
  // Данные для грида (плоский список документов)
  data: IUnsignedDocument[] = [];
  
  // Счётчик документов (для badge)
  countDocuments: number = 0;
  
  // Общее количество для пагинации
  totalCount: number = 0;
  
  // Состояние загрузки
  isLoading: boolean = false;
  
  // Фильтры
  filter: IUnsignedDocumentsFilter = {
    searchTerm: "",
    showOverdue: false,
    showPending: true,
    showApproved: false,
    showRejected: false,
  };
  
  // Временные фильтры (для попапа)
  tempFilters: IUnsignedDocumentsFilter = {
    searchTerm: "",
    showOverdue: false,
    showPending: true,
    showApproved: false,
    showRejected: false,
  };

  // Пагинация
  page: number = 0;
  pageSize: number = 100;
  
  // Сортировка
  sortBy: string | null = null;
  sortType: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Инициализация при загрузке страницы
  doLoad = () => {
    this.loadDocuments();
  };

  // Загрузка документов
  loadDocuments = async () => {
    try {
      runInAction(() => {
        this.isLoading = true;
      });

      const response = await getUnsignedDocuments(
        this.filter.searchTerm,
        this.filter.showOverdue
      );

      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        runInAction(() => {
          // Преобразуем сгруппированные данные в плоский список
          const flatDocuments: IUnsignedDocument[] = [];
          
          response.data.forEach((app: any) => {
            app.documents.forEach((doc: any) => {
              // Применяем фильтрацию по статусу на клиенте
              const shouldInclude = this.shouldIncludeDocument(doc.document_status);
              
              if (shouldInclude) {
                flatDocuments.push({
                  id: doc.uploaded_document_id,
                  uploaded_document_id: doc.uploaded_document_id,
                  document_name: doc.document_name,
                  // Нормализуем null в pending
                  document_status: doc.document_status || "pending",
                  app_id: app.app_id,
                  app_number: app.app_number,
                  app_work_description: app.app_work_description,
                  arch_object_address: app.arch_object_address,
                  full_name: app.full_name,
                  pin: app.pin,
                  service_name: app.service_name,
                  service_days: app.service_days,
                  deadline: app.deadline,
                  task_id: app.task_id,
                  app_step_id: app.app_step_id,
                });
              }
            });
          });

          this.data = flatDocuments;
          this.totalCount = flatDocuments.length;
          this.isLoading = false;
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      runInAction(() => {
        this.isLoading = false;
      });
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    }
  };

  // Проверка, нужно ли включать документ по статусу
  shouldIncludeDocument = (status: string | null): boolean => {
    // Обрабатываем null как pending
    const normalizedStatus = status || "pending";
    
    if (normalizedStatus === "pending" && this.filter.showPending) return true;
    if (normalizedStatus === "approved" && this.filter.showApproved) return true;
    if (normalizedStatus === "rejected" && this.filter.showRejected) return true;
    return false;
  };

  // Получение количества документов (для badge в хедере)
  getCountDocuments = async () => {
    try {
      const response = await getUnsignedDocuments("", false);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const count = response.data.flatMap((x: any) => x.documents)?.length || 0;
        runInAction(() => {
          this.countDocuments = count;
        });
      }
    } catch (err) {
      console.error("Error getting documents count:", err);
    }
  };

  // Проверка просроченности
  isOverdue = (deadline: string): boolean => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  // Изменение поискового запроса
  setSearchTerm = (value: string) => {
    runInAction(() => {
      this.filter.searchTerm = value;
    });
    this.loadDocuments();
  };

  // Обновление временного фильтра
  updateTempFilter = (key: keyof IUnsignedDocumentsFilter, value: boolean | string) => {
    runInAction(() => {
      (this.tempFilters as any)[key] = value;
    });
  };

  // Применение фильтров
  applyFilters = () => {
    runInAction(() => {
      this.filter = { ...this.tempFilters };
    });
    this.loadDocuments();
  };

  // Сброс фильтров
  resetFilters = () => {
    runInAction(() => {
      this.tempFilters = {
        searchTerm: "",
        showOverdue: false,
        showPending: true,
        showApproved: false,
        showRejected: false,
      };
      this.filter = { ...this.tempFilters };
    });
    this.loadDocuments();
  };

  // Навигация к заявке
  navigateToApplication = (taskId: number, appStepId: number) => {
    window.location.href = `/user/application_task/addedit?id=${taskId}&tab_id=1&app_step_id=${appStepId}`;
  };

  // Пагинация
  changePagination = (page: number, pageSize: number) => {
    runInAction(() => {
      this.page = page;
      this.pageSize = pageSize;
    });
    // Для клиентской пагинации перезагрузка не нужна
    // Если бэкенд поддерживает пагинацию - раскомментировать:
    // this.loadDocuments();
  };

  // Сортировка
  changeSort = (sortModel: GridSortModel) => {
    runInAction(() => {
      if (sortModel.length === 0) {
        this.sortBy = null;
        this.sortType = null;
      } else {
        this.sortBy = sortModel[0].field;
        this.sortType = sortModel[0].sort || null;
      }
    });
    // Сортировка на клиенте реализована в гриде
  };

  // Очистка store
  clearStore = () => {
    runInAction(() => {
      this.data = [];
      this.totalCount = 0;
      this.isLoading = false;
      this.page = 0;
      this.filter = {
        searchTerm: "",
        showOverdue: false,
        showPending: true,
        showApproved: false,
        showRejected: false,
      };
      this.tempFilters = { ...this.filter };
    });
  };
}

export default new UnsignedDocumentsStore();