import { Injectable, signal, effect, computed } from '@angular/core';
import { BoardTask, TaskStatus } from '../models/task.model';

// Extending the record to include a timestamp for synchronization priority
// interface BoardState extends Record<TaskStatus, BoardTask[]> {
//   _lastUpdated: number;
// }

// Define the shape of your board state properly
export interface BoardState {
  todo: BoardTask[];
  inprogress: BoardTask[];
  done: BoardTask[];
  _lastUpdated: number; // The metadata property
}

@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly STORAGE_KEY = 'nexus_board_state';
  
  // Track local changes to prevent infinite feedback loops or outdated overwrites
  private localTimestamp = 0;

  // Initialize from LocalStorage or use default state
  boardSignal = signal<BoardState>(this.loadFromStorage());
  searchTerm = signal('');

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
    this.localTimestamp = Date.now();

    this.boardSignal.update(board => {
      // TypeScript now knows _lastUpdated is allowed here
      const newBoard: BoardState = {
        todo: [...board.todo],
        inprogress: [...board.inprogress],
        done: [...board.done],
        _lastUpdated: this.localTimestamp
      };

      const taskIndex = newBoard[from].findIndex(t => t.id === taskId);
      if (taskIndex === -1) return board;

      const [task] = newBoard[from].splice(taskIndex, 1);
      newBoard[to].splice(newIndex, 0, { ...task, status: to });
      
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

  // Computed Signal: This automatically updates whenever searchTerm OR boardSignal changes
  filteredBoard = computed<BoardState>(() => {
    const term = this.searchTerm().toLowerCase();
    const board = this.boardSignal();
    
    if (!term) return board;

    return {
      _lastUpdated: board._lastUpdated,
      todo: board.todo.filter(t => t.title.toLowerCase().includes(term)),
      inprogress: board.inprogress.filter(t => t.title.toLowerCase().includes(term)),
      done: board.done.filter(t => t.title.toLowerCase().includes(term))
    };
  });
}