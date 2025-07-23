// stores/dashboard/DashboardStore.ts

import { makeAutoObservable } from 'mobx';
import { 
  WidgetConfig, 
  LayoutType, 
  ThemeMode, 
  Language 
} from '../../types/dashboard';
import { DEFAULT_WIDGET_CONFIG } from '../../constants/dashboard';

export class DashboardStore {
  widgets: WidgetConfig[] = [];
  layout: LayoutType = 'grid';
  theme: ThemeMode = 'light';
  language: Language = 'ru';
  isLoading = false;
  error: Error | null = null;

  constructor() {
    makeAutoObservable(this);
    this.initializeWidgets();
  }

  initializeWidgets() {
    this.widgets = [
      {
        id: 'widget-statistics',
        type: 'statistics',
        enabled: true,
        position: 0,
        size: 'normal',
        settings: DEFAULT_WIDGET_CONFIG.statistics
      },
      {
        id: 'widget-applications',
        type: 'applications',
        enabled: true,
        position: 1,
        size: 'expanded',
        settings: DEFAULT_WIDGET_CONFIG.applications
      },
      {
        id: 'widget-quickActions',
        type: 'quickActions',
        enabled: true,
        position: 2,
        size: 'normal',
        settings: DEFAULT_WIDGET_CONFIG.quickActions
      },
      {
        id: 'widget-calendar',
        type: 'calendar',
        enabled: true,
        position: 3,
        size: 'compact',
        settings: DEFAULT_WIDGET_CONFIG.calendar
      },
      {
        id: 'widget-reference',
        type: 'reference',
        enabled: true,
        position: 4,
        size: 'normal',
        settings: DEFAULT_WIDGET_CONFIG.reference
      }
    ];
  }

  setLayout(layout: LayoutType) {
    this.layout = layout;
  }

  setTheme(theme: ThemeMode) {
    this.theme = theme;
  }

  setLanguage(language: Language) {
    this.language = language;
  }

  updateWidgetConfig(widgetId: string, config: Partial<WidgetConfig>) {
    const widgetIndex = this.widgets.findIndex(w => w.id === widgetId);
    if (widgetIndex !== -1) {
      this.widgets[widgetIndex] = {
        ...this.widgets[widgetIndex],
        ...config
      };
    }
  }

  toggleWidget(widgetId: string) {
    const widget = this.widgets.find(w => w.id === widgetId);
    if (widget) {
      widget.enabled = !widget.enabled;
    }
  }

  reorderWidgets(widgets: WidgetConfig[]) {
    this.widgets = widgets.map((widget, index) => ({
      ...widget,
      position: index
    }));
  }

  updateWidgetSettings(widgetId: string, settings: any) {
    const widget = this.widgets.find(w => w.id === widgetId);
    if (widget) {
      widget.settings = {
        ...widget.settings,
        ...settings
      };
    }
  }

  setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  setError(error: Error | null) {
    this.error = error;
  }

  get enabledWidgets() {
    return this.widgets
      .filter(w => w.enabled)
      .sort((a, b) => a.position - b.position);
  }

  get isDarkMode() {
    if (this.theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return this.theme === 'dark';
  }

  async saveConfiguration() {
    try {
      this.setLoading(true);
      // API call to save configuration
      await new Promise(resolve => setTimeout(resolve, 1000));
      // localStorage fallback
      localStorage.setItem('dashboardConfig', JSON.stringify({
        widgets: this.widgets,
        layout: this.layout,
        theme: this.theme,
        language: this.language
      }));
    } catch (error) {
      this.setError(error as Error);
    } finally {
      this.setLoading(false);
    }
  }

  async loadConfiguration() {
    try {
      this.setLoading(true);
      // API call to load configuration
      await new Promise(resolve => setTimeout(resolve, 1000));
      // localStorage fallback
      const saved = localStorage.getItem('dashboardConfig');
      if (saved) {
        const config = JSON.parse(saved);
        this.widgets = config.widgets || this.widgets;
        this.layout = config.layout || this.layout;
        this.theme = config.theme || this.theme;
        this.language = config.language || this.language;
      }
    } catch (error) {
      this.setError(error as Error);
    } finally {
      this.setLoading(false);
    }
  }
}

export const dashboardStore = new DashboardStore();