// hooks/dashboard/useWidget.ts

import { useEffect, useState, useCallback } from 'react';
import { dashboardStore } from '../stores/dashboard/DashboardStore';

interface UseWidgetOptions {
  widgetId: string;
  refreshInterval?: number;
  onError?: (error: Error) => void;
}

export const useWidget = ({
  widgetId,
  refreshInterval,
  onError
}: UseWidgetOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const widgetConfig = dashboardStore.widgets.find(w => w.id === widgetId);

  const updateSettings = useCallback((settings: any) => {
    dashboardStore.updateWidgetSettings(widgetId, settings);
  }, [widgetId]);

  const toggleWidget = useCallback(() => {
    dashboardStore.toggleWidget(widgetId);
  }, [widgetId]);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Trigger refresh logic here
      setLastRefresh(new Date());
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const timer = setInterval(refresh, refreshInterval);
      return () => clearInterval(timer);
    }
  }, [refreshInterval, refresh]);

  return {
    widgetConfig,
    isLoading,
    error,
    lastRefresh,
    updateSettings,
    toggleWidget,
    refresh
  };
};