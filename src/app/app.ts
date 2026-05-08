import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardService } from './services/board.service';
import { TaskStatus } from './models/task.model';
import { TaskFormComponent } from './components/task-form/task-form';
import { 
  CdkDragDrop, 
  DragDropModule, 
  moveItemInArray 
} from '@angular/cdk/drag-drop';
import packageInfo from '../../package.json';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DragDropModule, TaskFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private boardService = inject(BoardService);
  showForm = signal(false); // Signal to toggle the form
  
  // 1. Expose the Signal from the service to the template
  board = this.boardService.filteredBoard;
  
  // 2. Define the columns for the @for loop in the HTML
  columns: TaskStatus[] = ['todo', 'inprogress', 'done'];
  
  searchTerm = this.boardService.searchTerm;
  
  // Simulated Git metadata
  gitInfo = {
    branch: 'main',
    hash: '585c082',
    version: packageInfo.version
  };

  updateSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  // 3. Define the drop handler logic
  drop(event: CdkDragDrop<any[]>, newStatus: string) {
    if (event.previousContainer === event.container) {
      // Logic for reordering within the same column
      moveItemInArray(
        event.container.data, 
        event.previousIndex, 
        event.currentIndex
      );
    } else {
      // Logic for moving between different columns
      const taskId = event.item.data.id;
      const previousStatus = event.previousContainer.id as TaskStatus;
      
      this.boardService.moveTask(
        taskId, 
        previousStatus, 
        newStatus as TaskStatus, 
        event.currentIndex
      );
    }
  }
  handleAddTask(taskData: any) {
    this.boardService.addTask(taskData);
    this.showForm.set(false); // Hide form after saving
  }
}