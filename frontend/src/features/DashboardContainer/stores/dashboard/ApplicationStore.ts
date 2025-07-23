// stores/dashboard/ApplicationsStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import { Application, ActionType, ApplicationStatus } from "../../types/dashboard";
import MainStore from "MainStore";
// import { getApplications, getDashboardApps } from "api/Application";
import i18n from "i18n";

export class ApplicationsStore {
  applications: Application[] = [];
  filteredApplications: Application[] = [];
  isLoading = false;
  error: Error | null = null;
  selectedFilters: ActionType[] = [];
  sortBy: "urgency" | "date" | "progress" = "urgency";

  constructor() {
    makeAutoObservable(this);
  }

  async fetchApplications() {
    try {
      this.setLoading(true);
      this.setError(null);

      // Simulated API call - replace with actual API
      // await new Promise((resolve) => setTimeout(resolve, 1500));

      // const response = await getDashboardApps();
      // if ((response.status === 201 || response.status === 200) && response?.data !== null) {
      //   const mockApplications = response.data;
      //
      //   runInAction(() => {
      //     this.applications = mockApplications;
      //     // this.applyFiltersAndSort();
      //   });
      // } else {
      //   throw new Error("Не получилось загрузить данные");
      // }

      // const mockApplications: Application[] = [
      //   {
      //     id: "2024-001",
      //     service_name: "Архитектурно-планировочное задание",
      //     status_code: "documents_ready",
      //     submissionDate: "2024-01-15",
      //     requiresAction: true,
      //     actionType: "documents",
      //     actionDescription:
      //       "Необходимо загрузить исправленное АПЗ с учетом замечаний технического совета",
      //     address: "г. Бишкек, ул. Киевская, 125",
      //     daysRemaining: 3,
      //     progress: 45,
      //     urgency: "high",
      //   },
      //   {
      //     id: "2024-002",
      //     serviceName: "Разрешение на строительство",
      //     status: "in_progress",
      //     submissionDate: "2024-01-10",
      //     requiresAction: true,
      //     actionType: "contract",
      //     actionDescription:
      //       "Контракт готов к подписанию. Используйте электронную цифровую подпись",
      //     address: "г. Бишкек, ул. Московская, 89",
      //     daysRemaining: 7,
      //     progress: 70,
      //     urgency: "high",
      //   },
      //   {
      //     id: "2024-003",
      //     serviceName: "Градостроительный план",
      //     status: "in_progress",
      //     submissionDate: "2024-01-08",
      //     requiresAction: true,
      //     actionType: "payment",
      //     actionDescription: "Необходимо оплатить государственную пошлину в размере 5000 сом",
      //     address: "г. Бишкек, ул. Чуй, 145",
      //     daysRemaining: 12,
      //     progress: 60,
      //     urgency: "medium",
      //   },
      //   {
      //     id: "2024-004",
      //     serviceName: "Разрешение на ввод в эксплуатацию",
      //     status: "completed",
      //     submissionDate: "2023-12-20",
      //     requiresAction: true,
      //     actionType: "review",
      //     actionDescription:
      //       "Документы готовы к получению. Разрешение на ввод в эксплуатацию оформлено",
      //     address: "г. Бишкек, ул. Льва Толстого, 78",
      //     progress: 100,
      //     urgency: "low",
      //   },
      // ];
    } catch (error) {
      runInAction(() => {
        this.setError(error as Error);
      });
    } finally {
      runInAction(() => {
        this.setLoading(false);
      });
    }
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: Error | null) {
    this.error = error;
  }

  // setFilter(filters: ActionType[]) {
  //   this.selectedFilters = filters;
  //   this.applyFiltersAndSort();
  // }

  // setSortBy(sortBy: "urgency" | "date" | "progress") {
  //   this.sortBy = sortBy;
  //   this.applyFiltersAndSort();
  // }

  // applyFiltersAndSort() {
  //   let filtered = [...this.applications];

  //   // Apply filters
  //   if (this.selectedFilters.length > 0) {
  //     filtered = filtered.filter(
  //       (app) => app.actionType && this.selectedFilters.includes(app.actionType)
  //     );
  //   }

  //   // Apply sorting
  //   filtered.sort((a, b) => {
  //     switch (this.sortBy) {
  //       case "urgency":
  //         const urgencyOrder = { high: 0, medium: 1, low: 2 };
  //         return (urgencyOrder[a.urgency || "low"] || 2) - (urgencyOrder[b.urgency || "low"] || 2);
  //       case "date":
  //         return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
  //       case "progress":
  //         return (b.progress || 0) - (a.progress || 0);
  //       default:
  //         return 0;
  //     }
  //   });

  //   this.filteredApplications = filtered;
  // }

  get requiresActionCount() {
    return this.applications.filter((app) => app.requiresAction).length;
  }

  get applicationsRequiringAction() {
    return this.applications
  }

  get totalApplications() {
    return this.applications.length;
  }

  // get inProgressCount() {
  //   return this.applications.filter((app) => app.status_code === "in_progress").length;
  // }

  // get completedCount() {
  //   return this.applications.filter((app) => app.status === "completed").length;
  // }

  // async updateApplication(id: string, updates: Partial<Application>) {
  //   try {
  //     this.setLoading(true);
  //     // API call to update application
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     runInAction(() => {
  //       const index = this.applications.findIndex((app) => app.id === id);
  //       if (index !== -1) {
  //         this.applications[index] = {
  //           ...this.applications[index],
  //           ...updates,
  //         };
  //         this.applyFiltersAndSort();
  //       }
  //     });
  //   } catch (error) {
  //     runInAction(() => {
  //       this.setError(error as Error);
  //     });
  //   } finally {
  //     runInAction(() => {
  //       this.setLoading(false);
  //     });
  //   }
  // }

  async refreshApplications() {
    await this.fetchApplications();
  }
}

export const applicationsStore = new ApplicationsStore();
