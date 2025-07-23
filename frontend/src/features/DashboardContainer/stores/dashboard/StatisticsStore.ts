// stores/dashboard/StatisticsStore.ts

import { makeAutoObservable, runInAction } from "mobx";
import { DashboardStats } from "../../types/dashboard";
import { GetApplicationsCountForMyStructure } from "api/Application/useGetApplications";
import dayjs from "dayjs";

export class StatisticsStore {
  stats: DashboardStats = {
    assigned_to_me: 0,
    completed_applications: 0,
    overdue_applications: 0,
    unsigned_documents: 0,
  };
  allApplications: any[] = [];
  assigned_to_me_list: any[] = [];
  completed_applications_list: any[] = [];
  overdue_applications_list: any[] = [];
  unsigned_documents_list: any[] = [];
  time_control: any[] = [];
  isLoading = false;
  startDate = null;
  endDate = null;
  error: Error | null = null;
  lastUpdated: Date | null = null;
  refreshInterval: number = 30000; // 30 seconds

  private refreshTimer: NodeJS.Timeout | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchStatistics() {
    try {
      this.setLoading(true);
      this.setError(null);
      if (this.startDate == null && this.endDate == null) {
        this.startDate = dayjs().subtract(7, 'day');
        this.endDate = dayjs();
      }
      const response = await GetApplicationsCountForMyStructure(this.startDate, this.endDate);
      if ((response.status === 201 || response.status === 200) && response?.data !== null) {
        const mockApplications = response.data;

        runInAction(() => {
          this.stats = {
            assigned_to_me: response.data.assigned_to_me.length ?? 0,
            completed_applications: response.data.completed_applications.length ?? 0,
            overdue_applications: response.data.overdue_applications.length ?? 0,
            unsigned_documents: response.data.unsigned_documents.length ?? 0
          };
          this.time_control = response.data.time_control;
          this.lastUpdated = new Date();

          const withCategory = (items: any[], category: string) =>
            items.map((x) => ({ ...x, category }));

          const all = [
            ...withCategory(response.data.assigned_to_me, 'assigned_to_me'),
            ...withCategory(response.data.overdue_applications, 'overdue_applications'),
            ...withCategory(response.data.unsigned_documents, 'unsigned_documents'),
          ];

          this.allApplications = all;
          this.assigned_to_me_list = response.data.assigned_to_me;
          this.completed_applications_list = response.data.completed_applications;
          this.overdue_applications_list = response.data.overdue_applications;
          this.unsigned_documents_list = response.data.unsigned_documents;
        });
      } else {
        throw new Error("Не получилось загрузить данные");
      }

      // const mockStats: DashboardStats = {
      //   total: 156,
      //   requiresAction: 4,
      //   inProgress: 12,
      //   completed: 140,
      // };
      //   runInAction(() => {
      //     this.stats = mockStats;
      //     this.lastUpdated = new Date();
      //   });
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

  updateStat(key: keyof DashboardStats, value: number) {
    this.stats[key] = value;
    this.lastUpdated = new Date();
  }

  incrementStat(key: keyof DashboardStats) {
    this.stats[key]++;
    this.lastUpdated = new Date();
  }

  decrementStat(key: keyof DashboardStats) {
    if (this.stats[key] > 0) {
      this.stats[key]--;
      this.lastUpdated = new Date();
    }
  }

  setRefreshInterval(interval: number) {
    this.refreshInterval = interval;
    this.stopAutoRefresh();
    this.startAutoRefresh();
  }

  startAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    this.refreshTimer = setInterval(() => {
      this.fetchStatistics();
    }, this.refreshInterval);
  }

  stopAutoRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  get statsArray() {
    return [
      { key: "assigned_to_me", value: this.stats.assigned_to_me },
      { key: "completed_applications", value: this.stats.completed_applications },
      { key: "overdue_applications", value: this.stats.overdue_applications },
      { key: "unsigned_documents", value: this.stats.unsigned_documents },
    ];
  }

  async refreshStatistics() {
    await this.fetchStatistics();
  }

  dispose() {
    this.stopAutoRefresh();
  }
}

export const statisticsStore = new StatisticsStore();
