// constants/dashboard.ts

export const WIDGET_TYPES = {
  STATISTICS: 'statistics',
  APPLICATIONS: 'applications',
  QUICK_ACTIONS: 'quickActions',
  CALENDAR: 'calendar',
  REFERENCE: 'reference'
} as const;

export const APPLICATION_STATUSES = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  REJECTED: 'rejected'
} as const;

export const ACTION_TYPES = {
  UPLOAD_DOCUMENTS: 'documents',
  SIGN_CONTRACT: 'contract',
  PAYMENT: 'payment',
  GET_RESULT: 'review'
} as const;

export const URGENCY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const;

export const LAYOUT_TYPES = {
  GRID: 'grid',
  FLEX: 'flex',
  MASONRY: 'masonry'
} as const;

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
} as const;

export const LANGUAGES = {
  RU: 'ru',
  KY: 'ky'
} as const;

export const WIDGET_SIZES = {
  COMPACT: 'compact',
  NORMAL: 'normal',
  EXPANDED: 'expanded'
} as const;

export const STATUS_COLORS = {
  draft: '#9E9E9E',
  in_progress: '#2196F3',
  completed: '#4CAF50',
  rejected: '#F44336'
} as const;

export const ACTION_TYPE_COLORS = {
  return_with_error: '#ff0000',
  documents_ready: '#2196F3',
  payment_required: '#FF9800',
  signature_required: '#9C27B0'
} as const;

export const URGENCY_COLORS = {
  high: '#F44336',
  medium: '#FF9800',
  low: '#4CAF50'
} as const;

export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920
} as const;

export const DEFAULT_WIDGET_CONFIG: Record<string, any> = {
  statistics: {
    size: 'normal',
    refreshInterval: 30000
  },
  applications: {
    maxItems: 4,
    showFilters: true,
    layout: 'grid'
  },
  quickActions: {
    columns: 4,
    size: 'md'
  },
  calendar: {
    compactMode: true
  },
  reference: {
    layout: 'horizontal'
  }
};