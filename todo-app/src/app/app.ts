import { Component } from '@angular/core';
import { TaskForm } from './tasks/task-form/task-form';
import { TaskList } from './tasks/task-list/task-list';

@Component({
  selector: 'app-root',
  imports: [TaskForm, TaskList],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
