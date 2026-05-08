export type TaskStatus = 'todo' | 'inprogress' | 'done';

export interface BoardTask {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: TaskStatus;
}