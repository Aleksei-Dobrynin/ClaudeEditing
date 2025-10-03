// Интерфейс для организации
export interface SmejPortalOrganization {
  id: number;
  organization_code: string;
  name: string;
  short_name: string;
  organization_type: string;
  inn: string;
  address: string;
  phone: string;
  email: string;
  is_active?: boolean;
  created_at?: Date | string;
  updated_at?: Date | string;
  created_by?: number;
  updated_by?: number;
}

// Интерфейс для заявки на согласование
export interface SmejPortalApprovalRequest {
  id: number;
  bga_application_number: string;
  organization_id?: number;
  applicant_name: string;
  approval_type: string;
  current_status: string;
  priority: string;
  operator_id?: number;
  received_date?: Date | string;
  deadline_date?: Date | string;
  completed_date?: Date | string;
  created_at?: Date | string;
  updated_at?: Date | string;
  created_by?: number;
  updated_by?: number;
}

// // Типы для статусов
// export type ApprovalStatus = 
//   | 'pending'
//   | 'in_progress'
//   | 'approved'
//   | 'rejected'
//   | 'on_hold';

// // Типы для приоритетов
// export type ApprovalPriority = 
//   | 'low'
//   | 'normal'
//   | 'high'
//   | 'urgent';

// // Типы для типов согласования
// export type ApprovalType = 
//   | 'construction'
//   | 'reconstruction'
//   | 'demolition'
//   | 'other';