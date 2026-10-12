import { Injectable, computed, effect, signal } from '@angular/core';
import { Task, TaskFilter } from './task';

const STORAGE_KEY = 'todo-app.tasks';

/**
 * Single source of truth for tasks.
 * State lives in signals; any component can inject this store and stay in sync.
 */
@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly tasks = signal<Task[]>(loadTasks());
  private readonly filter = signal<TaskFilter>('all');

  readonly currentFilter = this.filter.asReadonly();
  readonly totalCount = computed(() => this.tasks().length);
  readonly activeCount = computed(() => this.tasks().filter((t) => !t.completed).length);
  readonly completedCount = computed(() => this.totalCount() - this.activeCount());

  /** The slice of tasks that passes the currently selected filter. */
  readonly visibleTasks = computed(() => {
    switch (this.filter()) {
      case 'active':
        return this.tasks().filter((t) => !t.completed);
      case 'completed':
        return this.tasks().filter((t) => t.completed);
      default:
        return this.tasks();
    }
  });

  constructor() {
    // Persist on every change, in one place instead of inside each mutation.
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tasks()));
      } catch {
        // Storage can be unavailable (private mode, quota) — the app keeps working in memory.
      }
    });
  }

  add(title: string): void {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: Date.now(),
    };
    this.tasks.update((tasks) => [task, ...tasks]);
  }

  toggle(id: string): void {
    this.tasks.update((tasks) =>
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  }

  rename(id: string, title: string): void {
    this.tasks.update((tasks) => tasks.map((t) => (t.id === id ? { ...t, title } : t)));
  }

  remove(id: string): void {
    this.tasks.update((tasks) => tasks.filter((t) => t.id !== id));
  }

  clearCompleted(): void {
    this.tasks.update((tasks) => tasks.filter((t) => !t.completed));
  }

  setFilter(filter: TaskFilter): void {
    this.filter.set(filter);
  }
}

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return seedTasks();
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Task[]) : [];
  } catch {
    return [];
  }
}

/** First run only — a few examples so the app doesn't open empty. */
function seedTasks(): Task[] {
  const now = Date.now();
  return [
    { id: crypto.randomUUID(), title: 'Explore the Angular docs', completed: true, createdAt: now - 2 },
    { id: crypto.randomUUID(), title: 'Build my first component', completed: false, createdAt: now - 1 },
    { id: crypto.randomUUID(), title: 'Ship the todo app 🚀', completed: false, createdAt: now },
  ];
}
