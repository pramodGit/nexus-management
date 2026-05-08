import { Injectable, signal, effect } from '@angular/core';
import { BoardTask, TaskStatus } from '../models/task.model';

// Extending the record to include a timestamp for synchronization priority
interface BoardState extends Record<TaskStatus, BoardTask[]> {
  _lastUpdated: number;
}

@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly STORAGE_KEY = 'nexus_board_state';
  
  // Track local changes to prevent infinite feedback loops or outdated overwrites
  private localTimestamp = 0;

  // Initialize from LocalStorage or use default state
  boardSignal = signal<BoardState>(this.loadFromStorage());

  constructor() {
    // EFFECT: Automatically sync state to LocalStorage on every Signal change
    effect(() => {
      const state = this.boardSignal();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    });

    // EVENT LISTENER: Synchronize between browser tabs/windows
    window.addEventListener('storage', (event) => {
      if (event.key === this.STORAGE_KEY && event.newValue) {
        const incomingState: BoardState = JSON.parse(event.newValue);
        
        // Priority Logic: Only update if the incoming data is newer than our local version
        if (incomingState._lastUpdated > this.localTimestamp) {
          this.localTimestamp = incomingState._lastUpdated;
          this.boardSignal.set(incomingState);
        }
      }
    });
  }

  private loadFromStorage(): BoardState {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      this.localTimestamp = parsed._lastUpdated || 0;
      return parsed;
    }

    return {
      _lastUpdated: Date.now(),
      todo: [
        { id: '1', title: 'Nexus Core Init', description: 'Initialize v21 Zoneless app', priority: 'high', status: 'todo' },
        { id: '2', title: 'GitHub Sync', description: 'Prepare repository for Nexus', priority: 'medium', status: 'todo' }
      ],
      inprogress: [],
      done: []
    };
  }

  moveTask(taskId: string, from: TaskStatus, to: TaskStatus, newIndex: number) {
    this.localTimestamp = Date.now(); // Update our local priority clock

    this.boardSignal.update(board => {
      // Create deep copies of arrays to ensure Signal change detection fires correctly
      const newBoard: BoardState = {
        _lastUpdated: this.localTimestamp,
        todo: [...board.todo],
        inprogress: [...board.inprogress],
        done: [...board.done]
      };

      // 1. Find the task in the source column
      const taskIndex = newBoard[from].findIndex(t => t.id === taskId);
      if (taskIndex === -1) return board;

      // 2. Remove from source and update status
      const [task] = newBoard[from].splice(taskIndex, 1);
      const updatedTask = { ...task, status: to };

      // 3. Insert into the destination column at the specific index
      newBoard[to].splice(newIndex, 0, updatedTask);
      
      return newBoard;
    });
  }

  /**
   * Helper to add a new task (Ready for your "Create Task" UI)
   */
  addTask(task: Omit<BoardTask, 'id' | 'status'>) {
    this.localTimestamp = Date.now();
    const newTask: BoardTask = {
      ...task,
      id: Math.random().toString(36).substring(2, 9),
      status: 'todo'
    };

    this.boardSignal.update(board => ({
      ...board,
      _lastUpdated: this.localTimestamp,
      todo: [newTask, ...board.todo]
    }));
  }
}