import { makeAutoObservable, runInAction } from 'mobx';

interface BadgeConfig {
  menuId: string;
  count: number;
  loading: boolean;
  error: boolean;
  apiMethod: () => Promise<number>;
  refreshInterval?: number;
}

class MenuBadgeStore {
  badges: Map<string, BadgeConfig> = new Map();
  intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  // Регистрация badge для пункта меню
  registerBadge(
    menuId: string, 
    apiMethod: () => Promise<number>,
    refreshInterval?: number
  ) {
    this.badges.set(menuId, {
      menuId,
      count: 0,
      loading: false,
      error: false,
      apiMethod,
      refreshInterval
    });

    // Сразу загружаем данные
    this.fetchBadgeCount(menuId);

    // Если задан интервал - запускаем автообновление
    if (refreshInterval) {
      this.startAutoRefresh(menuId, refreshInterval);
    }
  }

  // Получить счётчик для пункта меню
  getBadgeCount(menuId: string): number {
    return this.badges.get(menuId)?.count || 0;
  }

  // Проверить загружается ли badge
  isBadgeLoading(menuId: string): boolean {
    return this.badges.get(menuId)?.loading || false;
  }

  // Загрузить данные для badge
  async fetchBadgeCount(menuId: string) {
    const badge = this.badges.get(menuId);
    if (!badge) return;

    runInAction(() => {
      badge.loading = true;
      badge.error = false;
    });

    try {
      const count = await badge.apiMethod();
      
      runInAction(() => {
        badge.count = count;
        badge.loading = false;
      });
    } catch (error) {
      console.error(`Error loading badge for ${menuId}:`, error);
      
      runInAction(() => {
        badge.error = true;
        badge.loading = false;
      });
    }
  }

  // Запустить автоматическое обновление
  startAutoRefresh(menuId: string, interval: number) {
    this.stopAutoRefresh(menuId);

    const intervalId = setInterval(() => {
      this.fetchBadgeCount(menuId);
    }, interval);

    this.intervals.set(menuId, intervalId);
  }

  // Остановить автоматическое обновление
  stopAutoRefresh(menuId: string) {
    const intervalId = this.intervals.get(menuId);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(menuId);
    }
  }

  // Обновить все badge
  refreshAllBadges() {
    this.badges.forEach((badge) => {
      this.fetchBadgeCount(badge.menuId);
    });
  }

  // Очистить все данные
  clearStore() {
    this.intervals.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    this.intervals.clear();
    this.badges.clear();
  }
}

const menuBadgeStore = new MenuBadgeStore();
export default menuBadgeStore;