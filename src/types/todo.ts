export interface Todo {
  id: string;
  todo: string;
  completed: boolean;
  userId: string;
  createdAt: number | null;
}

export interface TodoFormData {
  todo?: string;
  completed?: boolean;
}