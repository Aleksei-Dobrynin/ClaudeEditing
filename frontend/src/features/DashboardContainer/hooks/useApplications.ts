// hooks/dashboard/useApplications.ts

import { useEffect, useState, useCallback } from 'react';
import { applicationsStore } from '../stores/dashboard/ApplicationStore';
import { ActionType } from '../types/dashboard';

interface UseApplicationsOptions {
  autoFetch?: boolean;
  filters?: ActionType[];
  sortBy?: 'urgency' | 'date' | 'progress';
  limit?: number;
}

export const useApplications = ({
  autoFetch = true,
  filters = [],
  sortBy = 'urgency',
  limit
}: UseApplicationsOptions = {}) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (autoFetch && !isInitialized) {
      applicationsStore.fetchApplications();
      setIsInitialized(true);
    }
  }, [autoFetch, isInitialized]);

  // useEffect(() => {
  //   applicationsStore.setFilter(filters);
  // }, [filters]);

  // useEffect(() => {
  //   applicationsStore.setSortBy(sortBy);
  // }, [sortBy]);

  const refresh = useCallback(async () => {
    await applicationsStore.refreshApplications();
  }, []);

  // const updateApplication = useCallback(async (id: string, updates: any) => {
  //   await applicationsStore.updateApplication(id, updates);
  // }, []);

  const applications = limit 
    ? applicationsStore.applicationsRequiringAction.slice(0, limit)
    : applicationsStore.applicationsRequiringAction;

  return {
    applications,
    totalCount: applicationsStore.totalApplications,
    requiresActionCount: applicationsStore.requiresActionCount,
    // inProgressCount: applicationsStore.inProgressCount,
    // completedCount: applicationsStore.completedCount,
    isLoading: applicationsStore.isLoading,
    error: applicationsStore.error,
    refresh
  };
};