import React, { createContext, useContext } from 'react';

export type NotificationSeverity = 'success' | 'error' | 'warning' | 'info';

export interface NotificationOptions {
  message: string;
  severity?: NotificationSeverity;
  duration?: number;
  action?: React.ReactNode;
}

interface NotificationContextType {
  showNotification: (options: NotificationOptions | string) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};