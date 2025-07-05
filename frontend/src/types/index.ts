export interface Task {
  id: string;
  title: string;
  description: string;
  priority: number;
  priority_label: string;
  status: 'pending' | 'in_progress' | 'completed';
  category: string;
  category_name: string;
  category_color: string;
  due_date: string | null;
  ai_suggested: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  created_at: string;
  task_count: number;
}

export interface ContextEntry {
  id: string;
  content: string;
  type: 'email' | 'note' | 'message';
  processed: boolean;
  created_at: string;
}

export interface AIResponse {
  improved_description: string;
  priority_score: number;
  suggested_deadline: string;
  suggested_category: string;
  confidence: number;
}

export interface TaskStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  overdue: number;
}

export interface FilterOptions {
  status: string;
  category: string;
  priority: string;
  search: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}