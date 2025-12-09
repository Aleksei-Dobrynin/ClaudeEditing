export type ApplicationRoad = {
  id: number;
  from_status_id: number;
  to_status_id: number;
  rule_expression: string;
  description: string;
  validation_url: string;
  post_function_url: string;
  is_active: boolean;
  posts: number[];
  group_id: number;
};
