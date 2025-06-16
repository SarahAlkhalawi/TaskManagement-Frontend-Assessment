import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskService } from '../../../core/services/task'; 
import { TaskDto, TaskPriority, TaskStatus } from '../../../core/models/task.models';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-detail',
  standalone: true, 
   imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  task: TaskDto | null = null;
  isLoading = true;
  
  TaskPriority = TaskPriority;
  TaskStatus = TaskStatus;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTask(taskId);
    }
  }

  loadTask(id: string): void {
    this.taskService.getTask(id).subscribe({
      next: (task) => {
        this.task = task;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/tasks']);
      }
    });
  }

  editTask(): void {
    if (this.task) {
      const dialogRef = this.dialog.open(TaskFormComponent, {
        width: '600px',
        data: this.task
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && this.task) {
          this.loadTask(this.task.id);
        }
      });
    }
  }

  deleteTask(): void {
    if (this.task && confirm(`Are you sure you want to delete "${this.task.title}"?`)) {
      this.taskService.deleteTask(this.task.id).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tasks']);
  }

  getPriorityColor(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.Low: return 'primary';
      case TaskPriority.Medium: return 'accent';
      case TaskPriority.High: return 'warn';
      case TaskPriority.Critical: return 'warn';
      default: return 'primary';
    }
  }

  getStatusColor(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Pending: return 'primary';
      case TaskStatus.InProgress: return 'accent';
      case TaskStatus.Completed: return 'primary';
      case TaskStatus.Cancelled: return 'warn';
      default: return 'primary';
    }
  }

  getPriorityText(priority: TaskPriority): string {
    return TaskPriority[priority];
  }

  getStatusText(status: TaskStatus): string {
    return TaskStatus[status];
  }
}