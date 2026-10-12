import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TaskStore } from '../task-store';

@Component({
  selector: 'app-task-form',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm {
  protected readonly store = inject(TaskStore);

  /** Draft of the new task's title, bound to the input. */
  protected readonly title = signal('');

  protected add(): void {
    const value = this.title().trim();
    if (!value) return;

    this.store.add(value);
    this.title.set('');
  }
}
