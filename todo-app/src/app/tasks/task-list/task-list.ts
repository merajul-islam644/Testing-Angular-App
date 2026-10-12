import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { TaskFilter } from '../task';
import { TaskItem } from '../task-item/task-item';
import { TaskStore } from '../task-store';

@Component({
  selector: 'app-task-list',
  imports: [MatButtonModule, MatButtonToggleModule, MatIconModule, TaskItem],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList {
  protected readonly store = inject(TaskStore);

  protected readonly filters: { value: TaskFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Done' },
  ];
}
