// types/dashboard.ts

export type ApplicationStatus = 'draft' | 'in_progress' | 'completed' | 'rejected';
export type ActionType = 'return_with_error' | 'documents_ready' | 'payment_required' | 'signature_required';
export type WidgetType = 'statistics' | 'applications' | 'quickActions' | 'calendar' | 'reference';
export type WidgetSize = 'compact' | 'normal' | 'expanded';
export type LayoutType = 'grid' | 'flex' | 'masonry';
export type ThemeMode = 'light' | 'dark' | 'auto';
export type Language = 'ru' | 'ky';
export type Urgency = 'high' | 'medium' | 'low';

export interface Application {
  id: string;
  number: string;
  service_name: string;
  status_name: ApplicationStatus;
  service_id: number;
  registration_date: string;
  requiresAction: boolean;
  status_code?: ActionType;
  status_description?: string;
  address: string;
  daysRemaining?: number;
  progress?: number;
  urgency?: Urgency;
}

export interface DashboardStats {
  assigned_to_me: number;
  completed_applications: number;
  overdue_applications: number;
  unsigned_documents: number;
}

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  enabled: boolean;
  position: number;
  size?: WidgetSize;
  settings?: WidgetSettings;
}

export interface WidgetSettings {
  maxItems?: number;
  showFilters?: boolean;
  refreshInterval?: number;
  columns?: number;
  [key: string]: any;
}

export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color?: string;
  href?: string;
  description?: string;
  onClick?: () => void;
}

export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: 'deadline' | 'meeting' | 'reminder';
  description?: string;
}

export interface ReferenceSection {
  id: string;
  title: string;
  items: ReferenceItem[];
}

export interface ReferenceItem {
  id: string;
  title: string;
  href?: string;
  icon?: string;
  description?: string;
}

export interface DashboardContainerProps {
  layout?: LayoutType;
  theme?: ThemeMode;
  widgets: WidgetConfig[];
  onWidgetReorder?: (widgets: WidgetConfig[]) => void;
}

export interface StatisticsWidgetProps {
  size?: WidgetSize;
  onCardClick?: (statType: keyof DashboardStats) => void;
  refreshInterval?: number;
}

export interface ApplicationsWidgetProps {
  maxItems?: number;
  showFilters?: boolean;
  onApplicationClick?: (id: string) => void;
  layout?: 'grid' | 'list';
}

export interface QuickActionsWidgetProps {
  actions: QuickAction[];
  columns?: 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg';
}

export interface CalendarWidgetProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
  compactMode?: boolean;
}

export interface ReferenceWidgetProps {
  sections: ReferenceSection[];
  layout?: 'horizontal' | 'vertical';
}

export interface WidgetWrapperProps {
  title?: string;
  children: React.ReactNode;
  loading?: boolean;
  error?: Error | null;
  actions?: React.ReactNode;
  className?: string;
  onRefresh?: () => void;
  onClose?: () => void;
  sx?: any;
}