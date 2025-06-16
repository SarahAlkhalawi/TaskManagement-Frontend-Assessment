import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { TaskService } from '../../../core/services/task';
import { TaskDto, TaskFilterDto, TaskPriority, TaskStatus } from '../../../core/models/task.models';
import { PagedResult } from '../../../core/models/common.models';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDialogModule,
    
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: TaskDto[] = [];
  isLoading = false;
  totalCount = 0;
  pageSize = 10;
  pageNumber = 1;
  
  searchControl = new FormControl('');
  statusFilter = new FormControl('');
  priorityFilter = new FormControl('');
  
  TaskPriority = TaskPriority;
  TaskStatus = TaskStatus;
  
  displayedColumns: string[] = ['title', 'priority', 'status', 'createdAt', 'actions'];

  statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: TaskStatus.Pending, label: 'Pending' },
    { value: TaskStatus.InProgress, label: 'In Progress' },
    { value: TaskStatus.Completed, label: 'Completed' },
    { value: TaskStatus.Cancelled, label: 'Cancelled' }
  ];

  priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: TaskPriority.Low, label: 'Low' },
    { value: TaskPriority.Medium, label: 'Medium' },
    { value: TaskPriority.High, label: 'High' },
    { value: TaskPriority.Critical, label: 'Critical' }
  ];

  constructor(
    private taskService: TaskService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTasks();
    this.setupFilters();
  }

  setupFilters(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.pageNumber = 1;
        this.loadTasks();
      });

    this.statusFilter.valueChanges.subscribe(() => {
      this.pageNumber = 1;
      this.loadTasks();
    });

    this.priorityFilter.valueChanges.subscribe(() => {
      this.pageNumber = 1;
      this.loadTasks();
    });
  }

  loadTasks(): void {
    this.isLoading = true;
    
    const filter: TaskFilterDto = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      search: this.searchControl.value || undefined,
      status: this.statusFilter.value ? Number(this.statusFilter.value) : undefined,
      priority: this.priorityFilter.value ? Number(this.priorityFilter.value) : undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };

    this.taskService.getTasks(filter).subscribe({
      next: (result: PagedResult<TaskDto>) => {
        this.tasks = result.items;
        this.totalCount = result.totalCount;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: any): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadTasks();
  }

  openTaskForm(task?: TaskDto): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '600px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  viewTask(task: TaskDto): void {
    this.router.navigate(['/tasks', task.id]);
  }

  deleteTask(task: TaskDto): void {
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          this.loadTasks();
        },
        error: (error) => {
          console.error('Error deleting task:', error);
        }
      });
    }
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

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString();
  }

  clearFilters(): void {
  this.searchControl.setValue('');
  this.statusFilter.setValue('');
  this.priorityFilter.setValue('');
  this.pageNumber = 1;
  this.loadTasks();
}

hasFilters(): boolean {
  return !!(this.searchControl.value || this.statusFilter.value || this.priorityFilter.value);
}

getPriorityIcon(priority: TaskPriority): string {
  switch (priority) {
    case TaskPriority.Low: return 'keyboard_arrow_down';
    case TaskPriority.Medium: return 'remove';
    case TaskPriority.High: return 'keyboard_arrow_up';
    case TaskPriority.Critical: return 'priority_high';
    default: return 'remove';
  }
}

getStatusIcon(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.Pending: return 'schedule';
    case TaskStatus.InProgress: return 'hourglass_empty';
    case TaskStatus.Completed: return 'check_circle';
    case TaskStatus.Cancelled: return 'cancel';
    default: return 'help';
  }
}
}