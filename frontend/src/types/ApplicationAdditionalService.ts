export interface ApplicationAdditionalService {
  id: number;
  application_id: number;
  additional_service_id: number;
  service_name?: string;
  added_at_step_id: number;
  added_at_step_name?: string;
  insert_after_step_id: number;
  add_reason: string;
  requested_by: number;
  requested_by_name?: string;
  requested_at: string;
  status: "pending" | "active" | "completed" | "cancelled";
  first_added_step_id?: number;
  last_added_step_id?: number;
  completed_at?: string;
}

export interface AddStepsRequest {
  applicationId: number;
  additionalServiceId: number;
  addedAtStepId: number;
  insertAfterStepId: number;
  addReason: string;
}

export interface ServiceForAdding {
  id: number;
  name: string;
  description?: string;
}

export interface ServiceStep {
  id: number;
  name: string;
  order_number: number;
  description?: string;
  signers?: Signer[];
}

export interface Signer {
  id: number;
  order: number;
  role_id: number;
  role_name: string;
  department_id: number;
  department_name: string;
  is_required: boolean;
  description: string;
}