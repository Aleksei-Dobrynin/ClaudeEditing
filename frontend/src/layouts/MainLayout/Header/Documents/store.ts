import { makeAutoObservable, runInAction } from "mobx";
import i18n from "i18next";
import MainStore from "MainStore";
import {
  getApplicationDocument,
  getUnsignedDocuments,
} from "api/ApplicationDocument/useGetApplicationDocument";

export interface IDocument {
  uploaded_document_id: number;
  document_name: string;
  document_status: "pending" | "approved" | "rejected";
}

export interface IApplication {
  app_id: number;
  app_number: string;
  deadline: string;
  service_name: string;
  service_days: number;
  full_name: string;
  app_work_description: string;
  arch_object_address: string;
  task_id: number;
  app_step_id: number;
  pin: string;
  status: "pending" | "approved" | "rejected";
  documents: IDocument[];
}

// Интерфейс для фильтров
export interface IDocumentFilters {
  showOverdue: boolean;
  showPending: boolean;
  showApproved: boolean;
  showRejected: boolean;
}

// Статические данные вместо загрузки через API
// const mockApplications: IApplication[] = [
//   {
//     id: 554497,
//     deadline: "2025-06-18",
//     service: "АПЗ - Дополнение к АГЗ (10 р. дней)",
//     customer: 'ООО "ТехноСтрой"',
//     customerInn: "6666666666668",
//     status: "pending",
//     documents: [
//       { id: 1, name: "Техническое заключение", status: "pending" },
//       { id: 2, name: "Проектная документация", status: "pending" },
//     ],
//   },
//   {
//     id: 554496,
//     deadline: "2025-06-15",
//     service: "АПЗ - Дополнение к АПУ (10 р. дней)",
//     customer: "ИП Иванов А.А.",
//     customerInn: "6666666666669",
//     status: "pending",
//     documents: [
//       { id: 3, name: "Заявление на согласование", status: "pending" },
//       { id: 4, name: "Схема размещения", status: "pending" },
//       { id: 5, name: "Договор подряда", status: "pending" },
//     ],
//   },
//   {
//     id: 554495,
//     deadline: "2025-06-10",
//     service: "АПЗ - Дополнение к АГЗ (10 р. дней)",
//     customer: "Тестовый Тест",
//     customerInn: "112012000002036",
//     status: "pending",
//     documents: [{ id: 6, name: "Акт согласования", status: "pending" }],
//   },
//   {
//     id: 554494,
//     deadline: "2025-05-30",
//     service: "АПЗ - Разработка АГЗ без ИТУ",
//     customer: "Демо компа",
//     customerInn: "234234234234234",
//     status: "pending",
//     documents: [
//       { id: 7, name: "Договор подряда", status: "approved" },
//       { id: 8, name: "Техническое задание", status: "pending" },
//       { id: 9, name: "Календарный план", status: "pending" },
//     ],
//   },
// ];

class DocumentNotificationStore {
  // Данные
  applications: IApplication[] = []; // Отфильтрованные данные
  allApplications: IApplication[] = []; // Полный набор данных

  // Состояние UI
  drawerOpen: boolean = false;
  isLoading: boolean = false;

  // Текущий поисковый запрос
  searchTerm: string = "";
  countDocuments = 0;

  // Текущие фильтры (примененные)
  activeFilters: IDocumentFilters = {
    showOverdue: false,
    showPending: true,
    showApproved: false,
    showRejected: false,
  };

  // Временные фильтры (в процессе выбора)
  tempFilters: IDocumentFilters = {
    showOverdue: false,
    showPending: true,
    showApproved: false,
    showRejected: false,
  };

  // Состояние навигации
  redirectToId: number | null = null;

  constructor() {
    makeAutoObservable(this);

    // Инициализируем данные при создании
    this.applications = [...this.allApplications];
  }

  // Открыть/закрыть боковую панель
  toggleDrawer = () => {
    runInAction(() => {
      this.drawerOpen = !this.drawerOpen;

      // Если панель открывается, обновляем данные
      if (this.drawerOpen) {
        this.loadApplications();
      }
    });
  };

  // Установить строку поиска и обновить данные (имитация запроса к API)
  setSearchTerm = (term: string) => {
    runInAction(() => {
      this.searchTerm = term;

      // Сразу применяем поиск (имитация запроса к бэкенду)
      this.loadApplications();
    });
  };

  // Обновить временные фильтры (без применения)
  updateTempFilter = (key: keyof IDocumentFilters, value: boolean) => {
    runInAction(() => {
      this.tempFilters = {
        ...this.tempFilters,
        [key]: value,
      };
    });
  };

  // Применить фильтры и обновить данные
  applyFilters = () => {
    runInAction(() => {
      // Копируем временные фильтры в активные
      this.activeFilters = { ...this.tempFilters };

      // Загружаем данные с новыми фильтрами
      this.loadApplications();
    });
  };

  // Сбросить фильтры к значениям по умолчанию
  resetFilters = () => {
    runInAction(() => {
      this.tempFilters = {
        showOverdue: false,
        showPending: true,
        showApproved: false,
        showRejected: false,
      };
    });
  };

  // Проверка, просрочен ли документ
  isOverdue = (deadlineStr: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineStr);
    return deadline < today;
  };

  // Определение статуса заявки на основе статусов документов
  getApplicationStatus = (application: IApplication): "pending" | "approved" | "rejected" => {
    const { documents } = application;

    // Если все документы подписаны - заявка подписана
    if (documents.every((doc) => doc.document_status === "approved")) {
      return "approved";
    }

    // Если хотя бы один документ отклонен - заявка отклонена
    if (documents.some((doc) => doc.document_status === "rejected")) {
      return "rejected";
    }

    // В остальных случаях - в ожидании
    return "pending";
  };

  // Имитация загрузки данных с бэкенда с применением фильтров и поиска
  loadApplications = async () => {
    try {
      // Имитация начала запроса
      this.isLoading = true;

      const response = await getUnsignedDocuments(this.searchTerm, this.activeFilters.showOverdue);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        this.applications = response.data;
        this.isLoading = false;
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
  
  getCountDocuments = async () => {
    try {
      // Имитация начала запроса
      const response = await getUnsignedDocuments("", false);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        var count = response.data.flatMap(x => x.documents)?.length
        this.countDocuments = count
      } else {
        throw new Error();
      }
    } catch (err) {
      MainStore.setSnackbar(i18n.t("message:somethingWentWrong"), "error");
    }
  };

  // Функция фильтрации (имитация серверной логики)
  // private filterApplications(
  //   apps: IApplication[],
  //   filters: IDocumentFilters,
  //   search: string
  // ): IApplication[] {
  //   let result = [...apps];

  //   // Фильтр по статусу
  //   if (!filters.showApproved || !filters.showRejected || !filters.showPending) {
  //     result = result.filter((app) => {
  //       const status = this.getApplicationStatus(app);

  //       if (status === "approved" && !filters.showApproved) return false;
  //       if (status === "rejected" && !filters.showRejected) return false;
  //       if (status === "pending" && !filters.showPending) return false;

  //       return true;
  //     });
  //   }

  //   // Фильтр по дедлайну
  //   if (filters.showOverdue) {
  //     result = result.filter((app) => this.isOverdue(app.deadline));
  //   }

  //   // Поиск
  //   if (search) {
  //     const term = search.toLowerCase();
  //     result = result.filter(
  //       (app) =>
  //         app.id.toString().includes(term) ||
  //         app.service.toLowerCase().includes(term) ||
  //         app.customer.toLowerCase().includes(term) ||
  //         app.customerInn.includes(term) ||
  //         app.documents.some((doc) => doc.name.toLowerCase().includes(term))
  //     );
  //   }

  //   return result;
  // }

  // Получение количества уведомлений (просроченные заявки)
  get notificationCount() {
    return this.allApplications.filter(
      (app) => this.getApplicationStatus(app) === "pending" && this.isOverdue(app.deadline)
    ).length;
  }

  // Навигация к заявке
  navigateToApplication = (task_id: number, app_step_id: number) => {
    runInAction(() => {
      this.redirectToId = task_id;
      this.drawerOpen = false;
    });

    // Вывод в консоль для демонстрации
    // console.log(`Переход к заявке №${id}`);

    // Здесь будет логика навигации, например:
    // history.push(`/applications/${id}`);
    // или
    window.location.href = `/user/application_task/addedit?id=${task_id}&tab_id=1&app_step_id=${app_step_id}`;
  };

  // Очистка хранилища
  clearStore = () => {
    runInAction(() => {
      this.applications = [];
      this.drawerOpen = false;
      this.searchTerm = "";
      this.activeFilters = {
        showOverdue: false,
        showPending: true,
        showApproved: false,
        showRejected: false,
      };
      this.tempFilters = { ...this.activeFilters };
      this.redirectToId = null;
    });
  };
}

export default new DocumentNotificationStore();
