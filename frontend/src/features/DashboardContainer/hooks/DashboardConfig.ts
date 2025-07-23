// hooks/dashboard/useDashboardConfig.ts

import { useEffect, useCallback } from 'react';
import { dashboardStore } from '../stores/dashboard/DashboardStore';
import { WidgetConfig, LayoutType, ThemeMode, Language } from '../types/dashboard';

export const useDashboardConfig = () => {
  useEffect(() => {
    dashboardStore.loadConfiguration();
  }, []);

  const saveConfig = useCallback(async () => {
    await dashboardStore.saveConfiguration();
  }, []);

  const updateLayout = useCallback((layout: LayoutType) => {
    dashboardStore.setLayout(layout);
  }, []);

  const updateTheme = useCallback((theme: ThemeMode) => {
    dashboardStore.setTheme(theme);
  }, []);

  const updateLanguage = useCallback((language: Language) => {
    dashboardStore.setLanguage(language);
  }, []);

  const reorderWidgets = useCallback((widgets: WidgetConfig[]) => {
    dashboardStore.reorderWidgets(widgets);
  }, []);

  const toggleWidget = useCallback((widgetId: string) => {
    dashboardStore.toggleWidget(widgetId);
  }, []);

  const updateWidgetConfig = useCallback((widgetId: string, config: Partial<WidgetConfig>) => {
    dashboardStore.updateWidgetConfig(widgetId, config);
  }, []);

  return {
    // State
    widgets: dashboardStore.widgets,
    enabledWidgets: dashboardStore.enabledWidgets,
    layout: dashboardStore.layout,
    theme: dashboardStore.theme,
    language: dashboardStore.language,
    isDarkMode: dashboardStore.isDarkMode,
    isLoading: dashboardStore.isLoading,
    error: dashboardStore.error,
    
    // Actions
    saveConfig,
    updateLayout,
    updateTheme,
    updateLanguage,
    reorderWidgets,
    toggleWidget,
    updateWidgetConfig
  };
};