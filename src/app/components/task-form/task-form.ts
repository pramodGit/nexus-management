import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-container">
      <h3>Create New Task</h3>
      <input [(ngModel)]="title" placeholder="What needs to be done?" />
      <textarea [(ngModel)]="description" placeholder="Description..."></textarea>
      
      <div class="actions">
        <select [(ngModel)]="priority">
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button (click)="submit()" [disabled]="!title()">Add Task</button>
        <button class="cancel" (click)="onCancel.emit()">Cancel</button>
      </div>
    </div>
  `,
  styles: [`
    .form-container {
      background: white; border: 1px solid #dfe1e6;
      padding: 15px; border-radius: 8px; margin-bottom: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    input, textarea, select {
      width: 100%; margin-bottom: 10px; padding: 8px;
      border: 1px solid #ddd; border-radius: 4px;
    }
    .actions { display: flex; gap: 10px; }
    button { background: #0052cc; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #ebecf0; color: #a5adba; }
    .cancel { background: transparent; color: #42526e; }
  `]
})
export class TaskFormComponent {
  title = signal('');
  description = signal('');
  priority = signal<'low' | 'medium' | 'high'>('medium');

  onSave = output<{title: string, description: string, priority: 'low' | 'medium' | 'high'}>();
  onCancel = output<void>();

  submit() {
    this.onSave.emit({
      title: this.title(),
      description: this.description(),
      priority: this.priority()
    });
    // Reset form
    this.title.set('');
    this.description.set('');
  }
}