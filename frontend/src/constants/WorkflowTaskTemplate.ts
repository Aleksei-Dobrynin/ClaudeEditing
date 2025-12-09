export type WorkflowTaskTemplate = {
  id: number;
  workflow_id: number;
  name: string;
  order: number;
  is_active: boolean;
  is_required: boolean;
  description: string;
  structure_id: number;
};
