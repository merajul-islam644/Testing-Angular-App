import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Task } from '../task';
import { TaskStore } from '../task-store';

@Component({
  selector: 'app-task-item',
  imports: [
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
})
export class TaskItem {
  protected readonly store = inject(TaskStore);
  private readonly dialog = inject(MatDialog);

  readonly task = input.required<Task>();

  protected edit(): void {
    const ref = this.dialog.open(TaskEditDialog, {
      data: { title: this.task().title },
      width: '340px',
    });

    ref.afterClosed().subscribe((title?: string) => {
      if (typeof title === 'string' && title.trim()) {
        this.store.rename(this.task().id, title.trim());
      }
    });
  }
}

@Component({
  selector: 'app-task-edit-dialog',
  imports: [
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Edit task</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full">
        <mat-label>Title</mat-label>
        <input matInput [(ngModel)]="title" (keyup.enter)="save()" cdkFocusInitial />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button (click)="save()" [disabled]="!title.trim()">Save</button>
    </mat-dialog-actions>
  `,
  styles: `
    .full {
      width: 100%;
      min-width: 260px;
    }
  `,
})
export class TaskEditDialog {
  protected readonly title: string = inject<{ title: string }>(MAT_DIALOG_DATA).title;

  private readonly dialogRef = inject(MatDialogRef);

  protected save(): void {
    const value = this.title.trim();
    if (value) this.dialogRef.close(value);
  }
}
